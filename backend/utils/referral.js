const Wallet = require('../models/Wallet');
const Referral = require('../models/Referral');
const User = require('../models/User');

// Process referral commission for products
async function processReferralCommission(order) {
  try {
    // Check if order has product referrals
    if (!order.referralProducts || order.referralProducts.length === 0) {
      return;
    }
    
    const commissionPercentage = 5;
    let totalCommission = 0;
    
    // Process each referred product
    for (const refProduct of order.referralProducts) {
      // Find the product in order items
      const orderItem = order.items.find(
        item => item.product.toString() === refProduct.product.toString()
      );
      
      if (!orderItem) continue;
      
      // Calculate commission for this product
      const productTotal = orderItem.price * orderItem.quantity;
      const commissionAmount = (productTotal * commissionPercentage) / 100;
      
      // Create referral record
      await Referral.create({
        referrer: refProduct.referrer,
        referred: order.user,
        product: refProduct.product,
        order: order._id,
        commissionAmount,
        commissionPercentage,
        referralType: 'product',
        status: 'pending'
      });
      
      totalCommission += commissionAmount;
    }
    
    // Update order with total referral commission
    order.referralCommission = {
      totalAmount: totalCommission,
      credited: false
    };
    await order.save();
    
    // For prepaid orders, credit immediately
    if (order.paymentMethod === 'online' && order.paymentStatus === 'paid') {
      await creditReferralCommission(order._id);
    }
    
    console.log(`✅ Processed referral commission: ₹${totalCommission}`);
    return totalCommission;
  } catch (error) {
    console.error('Referral commission processing error:', error);
  }
}

// Credit referral commission to wallet
async function creditReferralCommission(orderId) {
  try {
    const Order = require('../models/Order');
    const order = await Order.findById(orderId);
    
    if (!order || order.referralCommission?.credited) {
      return;
    }
    
    // Get all pending referrals for this order
    const referrals = await Referral.find({ 
      order: order._id, 
      status: 'pending' 
    });
    
    if (referrals.length === 0) {
      return;
    }
    
    // Credit each referrer
    for (const referral of referrals) {
      // Get or create wallet for referrer
      let wallet = await Wallet.findOne({ user: referral.referrer });
      if (!wallet) {
        wallet = await Wallet.create({ user: referral.referrer });
      }
      
      // Get product name
      const Product = require('../models/Product');
      const product = await Product.findById(referral.product);
      
      // Add credit to wallet
      await wallet.addCredit(
        referral.commissionAmount,
        `Product referral commission from order #${order.orderNumber} - ${product?.name || 'Product'}`,
        order.user,
        order._id
      );
      
      // Update referral status
      referral.status = 'credited';
      referral.creditedAt = new Date();
      await referral.save();
      
      console.log(`✅ Credited ₹${referral.commissionAmount} to referrer wallet for product referral`);
    }
    
    // Update order
    order.referralCommission.credited = true;
    order.referralCommission.creditedAt = new Date();
    await order.save();
    
    return true;
  } catch (error) {
    console.error('Credit referral commission error:', error);
  }
}

module.exports = {
  processReferralCommission,
  creditReferralCommission
};
