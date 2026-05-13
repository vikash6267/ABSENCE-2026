const express = require('express');
const router = express.Router();
const { createOrder, verifySignature } = require('../utils/razorpay');
const Order = require('../models/Order');
const Counter = require('../models/Counter');
const PaymentLedger = require('../models/PaymentLedger');
const PaymentIntent = require('../models/PaymentIntent');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { sendOrderMail } = require('../utils/orderEmail');
const { protect, authorize } = require('../middleware/auth');

const getNextOrderNumber = async () => {
  let counter = await Counter.findOne({ key: 'order_number' });

  if (!counter) {
    const latestMtcOrder = await Order.findOne({ orderNumber: /^MTC-\d+$/ })
      .sort({ createdAt: -1 })
      .select('orderNumber')
      .lean();

    let startSeq = 0;
    if (latestMtcOrder?.orderNumber) {
      const parts = latestMtcOrder.orderNumber.split('-');
      startSeq = Number(parts[1] || 0);
    }

    counter = await Counter.create({ key: 'order_number', seq: startSeq });
  }

  counter = await Counter.findOneAndUpdate(
    { key: 'order_number' },
    { $inc: { seq: 1 } },
    { new: true }
  );

  return `MTC-${String(counter.seq).padStart(5, '0')}`;
};

const normalizeWalletAmount = (value) => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Number(amount.toFixed(2));
};

router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, lead } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await PaymentIntent.create({
      user: req.user._id,
      amount: Number(amount),
      customer: {
        name: lead?.name || req.user.name,
        email: lead?.email || req.user.email,
        phone: lead?.phone || req.user.phone,
      },
      shippingAddress: lead?.shippingAddress || {},
      items: lead?.items || [],
      subtotal: Number(lead?.subtotal || 0),
      discount: Number(lead?.discount || 0),
      shippingCost: Number(lead?.shippingCost || 0),
      walletUsed: normalizeWalletAmount(lead?.walletUsed),
      total: Number(lead?.total || amount),
      couponUsed: lead?.couponUsed || null,
      status: 'clicked',
    });

    try {
      const razorpayOrder = await createOrder(amount, 'INR', paymentIntent._id.toString());
      paymentIntent.razorpayOrderId = razorpayOrder.id;
      paymentIntent.status = 'gateway_order_created';
      await paymentIntent.save();

      return res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentIntentId: paymentIntent._id,
      });
    } catch (gatewayError) {
      paymentIntent.status = 'failed';
      paymentIntent.failureReason = gatewayError.message;
      await paymentIntent.save();
      throw gatewayError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/wallet-checkout', protect, async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Order payload missing' });
    }

    const walletUsed = normalizeWalletAmount(orderData.walletUsed);
    if (walletUsed <= 0) {
      return res.status(400).json({ message: 'Wallet amount is required for wallet checkout' });
    }

    const subtotal = Number(orderData.subtotal || 0);
    const discount = Number(orderData.discount || 0);
    const shippingCost = Number(orderData.shippingCost || 0);
    const expectedTotal = Number((subtotal + shippingCost - discount - walletUsed).toFixed(2));
    if (expectedTotal !== 0 || Number(orderData.total || 0) !== 0) {
      return res.status(400).json({ message: 'Wallet checkout is only allowed for zero-payable orders' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    if (wallet.balance < walletUsed) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const orderNumber = await getNextOrderNumber();
    wallet = await wallet.deduct(walletUsed, `Wallet used in order ${orderNumber}`);

    let order;
    try {
      order = await Order.create({
        ...orderData,
        walletUsed,
        user: req.user._id,
        orderNumber,
        paymentMethod: 'wallet',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        statusHistory: [
          { status: 'pending', note: 'Order created via wallet checkout' },
          { status: 'confirmed', note: `Paid fully using wallet (Rs. ${walletUsed.toFixed(2)})` },
        ],
      });
    } catch (orderError) {
      await wallet.addCredit(walletUsed, `Wallet refund for failed order ${orderNumber}`);
      throw orderError;
    }

    const txn = wallet.transactions[wallet.transactions.length - 1];
    if (txn) {
      txn.order = order._id;
      await wallet.save();
    }

    if (order.referralProducts && order.referralProducts.length > 0) {
      const { processReferralCommission } = require('../utils/referral');
      await processReferralCommission(order);
    }

    try {
      await sendOrderMail({ to: req.user.email, order, context: 'created' });
    } catch (emailError) {
      console.error('Wallet checkout order email failed:', emailError.message);
    }

    await PaymentLedger.create({
      order: order._id,
      user: req.user._id,
      transactionType: 'payment',
      amount: 0,
      status: 'success',
      paymentMethod: 'wallet',
      metadata: {
        walletUsed,
        note: 'Fully paid by wallet',
      },
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature, paymentIntentId, orderData } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Missing payment verification payload' });
    }

    const existingOrder = await Order.findOne({ razorpayPaymentId: paymentId });
    if (existingOrder) {
      return res.json({ success: true, order: existingOrder });
    }

    const isValid = verifySignature(orderId, paymentId, signature);
    const paymentIntent = paymentIntentId ? await PaymentIntent.findById(paymentIntentId) : null;

    if (!isValid) {
      if (paymentIntent) {
        paymentIntent.status = 'failed';
        paymentIntent.failureReason = 'Invalid signature';
        paymentIntent.razorpayPaymentId = paymentId;
        paymentIntent.razorpaySignature = signature;
        await paymentIntent.save();
      }
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Order payload missing' });
    }

    const subtotal = Number(orderData.subtotal || 0);
    const discount = Number(orderData.discount || 0);
    const shippingCost = Number(orderData.shippingCost || 0);
    const walletUsed = normalizeWalletAmount(orderData.walletUsed);
    const expectedTotal = Number((subtotal + shippingCost - discount - walletUsed).toFixed(2));
    const providedTotal = Number(orderData.total || 0);

    if (Math.abs(expectedTotal - providedTotal) > 0.01) {
      return res.status(400).json({ message: 'Order totals mismatch' });
    }

    let wallet = null;
    if (walletUsed > 0) {
      wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) {
        wallet = await Wallet.create({ user: req.user._id });
      }
      if (wallet.balance < walletUsed) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
    }

    const orderNumber = await getNextOrderNumber();
    if (walletUsed > 0) {
      wallet = await wallet.deduct(walletUsed, `Wallet used in order ${orderNumber}`);
    }

    let order;
    try {
      order = await Order.create({
        ...orderData,
        walletUsed,
        user: req.user._id,
        orderNumber,
        paymentMethod: 'online',
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        statusHistory: [
          { status: 'pending', note: 'Order created after successful payment' },
          { status: 'confirmed', note: 'Payment verified and confirmed' },
          ...(walletUsed > 0 ? [{ status: 'confirmed', note: `Wallet used: Rs. ${walletUsed.toFixed(2)}` }] : []),
        ],
      });
    } catch (orderError) {
      if (walletUsed > 0 && wallet) {
        await wallet.addCredit(walletUsed, `Wallet refund for failed order ${orderNumber}`);
      }
      throw orderError;
    }

    if (walletUsed > 0 && wallet) {
      const txn = wallet.transactions[wallet.transactions.length - 1];
      if (txn) {
        txn.order = order._id;
        await wallet.save();
      }
    }

    // Process referral commission for prepaid orders
    if (order.referralProducts && order.referralProducts.length > 0) {
      const { processReferralCommission } = require('../utils/referral');
      await processReferralCommission(order);
    }

    try {
      await sendOrderMail({ to: req.user.email, order, context: 'created' });
    } catch (emailError) {
      console.error('Payment verify order email failed:', emailError.message);
    }

    const shipping = order.shippingAddress || {};
    const hasAddressPayload = shipping.addressLine1 || shipping.city || shipping.pincode;
    if (hasAddressPayload) {
      const user = await User.findById(req.user._id);
      if (user) {
        const currentAddresses = user.addresses || [];
        const normalizedIncoming = {
          name: shipping.name || user.name,
          phone: shipping.phone || user.phone,
          addressLine1: shipping.addressLine1 || '',
          addressLine2: shipping.addressLine2 || '',
          city: shipping.city || '',
          state: shipping.state || '',
          pincode: shipping.pincode || '',
        };

        const existingIdx = currentAddresses.findIndex((addr) => {
          return (
            String(addr.addressLine1 || '').trim().toLowerCase() === normalizedIncoming.addressLine1.trim().toLowerCase() &&
            String(addr.city || '').trim().toLowerCase() === normalizedIncoming.city.trim().toLowerCase() &&
            String(addr.pincode || '').trim() === normalizedIncoming.pincode.trim() &&
            String(addr.phone || '').trim() === String(normalizedIncoming.phone || '').trim()
          );
        });

        if (existingIdx === -1) {
          user.addresses.push({
            ...normalizedIncoming,
            isDefault: currentAddresses.length === 0,
          });
        } else {
          user.addresses[existingIdx].name = normalizedIncoming.name;
          user.addresses[existingIdx].phone = normalizedIncoming.phone;
          user.addresses[existingIdx].addressLine2 = normalizedIncoming.addressLine2;
          user.addresses[existingIdx].state = normalizedIncoming.state;
        }

        if (normalizedIncoming.phone && !user.phone) {
          user.phone = normalizedIncoming.phone;
        }
        await user.save();
      }
    }

    await PaymentLedger.create({
      order: order._id,
      user: req.user._id,
      transactionType: 'payment',
      amount: order.total,
      gatewayTransactionId: paymentId,
      gatewayOrderId: orderId,
      gatewaySignature: signature,
      status: 'success',
      paymentMethod: 'razorpay',
    });

    if (paymentIntent) {
      paymentIntent.status = 'paid';
      paymentIntent.order = order._id;
      paymentIntent.razorpayPaymentId = paymentId;
      paymentIntent.razorpaySignature = signature;
      await paymentIntent.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ledger', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'user' ? { user: req.user._id } : {};
    const ledger = await PaymentLedger.find(filter)
      .populate('order', 'orderNumber total')
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/intent-status', protect, async (req, res) => {
  try {
    const { paymentIntentId, status, failureReason } = req.body;

    if (!paymentIntentId || !status) {
      return res.status(400).json({ message: 'paymentIntentId and status are required' });
    }

    const intent = await PaymentIntent.findById(paymentIntentId);
    if (!intent) {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    if (intent.user.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (intent.status !== 'paid') {
      intent.status = status;
      if (failureReason) intent.failureReason = failureReason;
      await intent.save();
    }

    res.json({ success: true, intent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/payment-prospects', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { segment = 'all' } = req.query;
    const filter = {};
    if (segment === 'follow_up') {
      filter.status = { $ne: 'paid' };
    } else if (segment === 'converted') {
      filter.status = 'paid';
    }

    const records = await PaymentIntent.find(filter)
      .populate('user', 'name email phone')
      .populate('order', 'orderNumber total orderStatus')
      .sort('-createdAt');

    const [total, converted] = await Promise.all([
      PaymentIntent.countDocuments({}),
      PaymentIntent.countDocuments({ status: 'paid' }),
    ]);

    const summary = {
      total,
      converted,
      followUp: total - converted,
    };

    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
