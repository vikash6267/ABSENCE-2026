const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const Counter = require('../models/Counter');
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

const canAccessOrder = (user, orderUserId) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'superadmin') return true;
  return orderUserId.toString() === user._id.toString();
};

router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'user' ? { user: req.user._id } : {};
    const orders = await Order.find(filter).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/number/:orderNumber', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (!canAccessOrder(req.user, order.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/invoice/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'images variants');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${order.orderNumber || 'invoice'}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 44 });
    doc.pipe(res);

    const margin = 44;
    const contentWidth = doc.page.width - margin * 2;
    const pageBottom = () => doc.page.height - margin;
    let y = margin;
    let itemsTableStarted = false;

    const fetchImageBuffer = (url) =>
      new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (response) => {
          if (response.statusCode !== 200) {
            response.resume();
            resolve(null);
            return;
          }
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', () => resolve(null));
        req.setTimeout(3500, () => {
          req.destroy();
          resolve(null);
        });
      });

    const getItemImageSource = async (item) => {
      const itemImage = typeof item?.image === 'string' ? item.image.trim() : '';
      const productImage =
        item?.product?.images?.[0]?.url ||
        item?.product?.variants?.[0]?.images?.[0]?.url ||
        '';
      const image = itemImage || productImage;
      if (!image) return null;

      if (image.startsWith('http://') || image.startsWith('https://')) {
        return await fetchImageBuffer(image);
      }

      const normalized = image.replace(/\\/g, '/');
      const candidates = [
        path.join(__dirname, '..', normalized),
        path.join(__dirname, '..', '..', normalized),
        path.join(__dirname, '..', '..', 'frontend', 'public', normalized),
      ];

      for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
          return filePath;
        }
      }
      return null;
    };

    const drawHeader = (firstPage = true) => {
      const logoPath = path.join(__dirname, '../../frontend/public/logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, margin, y, { width: 72 });
      }

      doc.fillColor('#111').font('Helvetica-Bold').fontSize(24).text('ABSENCE', margin + 90, y + 6);
      doc.fillColor('#555').font('Helvetica').fontSize(10).text('Streetwear Pvt. Ltd.', margin + 90, y + 34);
      doc.text('support@wearabsence.com', margin + 90, y + 48);
      doc.text('+91-99999-99999', margin + 90, y + 62);

      doc.fillColor('#111').font('Helvetica-Bold').fontSize(11).text('Tax Invoice', margin, y + 6, {
        width: contentWidth,
        align: 'right',
      });
      doc.font('Helvetica').fontSize(10).text(`Invoice #: ${order.orderNumber}`, margin, y + 22, {
        width: contentWidth,
        align: 'right',
      });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, margin, y + 36, {
        width: contentWidth,
        align: 'right',
      });
      if (!firstPage) {
        doc.fillColor('#666').fontSize(9).text('Continued', margin, y + 6, {
          width: contentWidth,
          align: 'right',
        });
      }

      y += 84;
      doc.moveTo(margin, y).lineTo(margin + contentWidth, y).strokeColor('#ddd').stroke();
      y += 16;
    };

    const drawItemsHeader = () => {
      doc.rect(margin, y, contentWidth, 24).fill('#f6f8fb');
      doc.fillColor('#111').font('Helvetica-Bold').fontSize(10);
      doc.text('Image', margin + 8, y + 7, { width: 40 });
      doc.text('Product', margin + 54, y + 7, { width: 210 });
      doc.text('Size', margin + 268, y + 7, { width: 40 });
      doc.text('Qty', margin + 310, y + 7, { width: 34 });
      doc.text('Unit Price', margin + 346, y + 7, { width: 74, align: 'right' });
      doc.text('Total', margin + 424, y + 7, { width: 74, align: 'right' });
      y += 30;
      itemsTableStarted = true;
    };

    const addPage = ({ withItemsHeader = false } = {}) => {
      doc.addPage();
      y = margin;
      drawHeader(false);
      if (withItemsHeader) {
        drawItemsHeader();
      }
    };

    const ensureSpace = (requiredHeight, { withItemsHeader = false } = {}) => {
      if (y + requiredHeight <= pageBottom()) return;
      addPage({ withItemsHeader });
    };

    drawHeader(true);

    const billedToLines = [
      order.shippingAddress?.name || order.user?.name || '-',
      order.shippingAddress?.phone || order.user?.phone || '-',
      order.shippingAddress?.addressLine1 || '-',
      order.shippingAddress?.addressLine2 || null,
      `${order.shippingAddress?.city || '-'}, ${order.shippingAddress?.state || '-'} - ${order.shippingAddress?.pincode || '-'}`,
    ].filter(Boolean);

    ensureSpace(120);
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(12).text('Billed To', margin, y);
    y += 18;
    doc.fillColor('#333').font('Helvetica').fontSize(11);
    billedToLines.forEach((line) => {
      const lineHeight = doc.heightOfString(line, { width: contentWidth * 0.6, align: 'left' });
      doc.text(line, margin, y, { width: contentWidth * 0.6, align: 'left' });
      y += Math.max(15, lineHeight + 2);
    });

    y += 8;
    ensureSpace(72);
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(12).text('Items', margin, y);
    y += 16;
    drawItemsHeader();

    doc.font('Helvetica').fontSize(10);
    for (const item of order.items || []) {
      const productText = String(item.name || '-');
      const productHeight = doc.heightOfString(productText, { width: 210 });
      const rowHeight = Math.max(44, productHeight + 8);

      ensureSpace(rowHeight + 8, { withItemsHeader: itemsTableStarted });

      const thumbSize = 36;
      const thumbX = margin + 8;
      const thumbY = y + Math.max(2, (rowHeight - thumbSize) / 2);
      doc.rect(thumbX, thumbY, thumbSize, thumbSize).lineWidth(0.8).strokeColor('#e3e6ea').stroke();

      const imageSource = await getItemImageSource(item);
      if (imageSource) {
        try {
          doc.image(imageSource, thumbX + 1, thumbY + 1, {
            fit: [thumbSize - 2, thumbSize - 2],
            align: 'center',
            valign: 'center',
          });
        } catch (e) {
          doc.fillColor('#9aa0a6').fontSize(7).text('No Img', thumbX, thumbY + 14, {
            width: thumbSize,
            align: 'center',
          });
        }
      } else {
        doc.fillColor('#9aa0a6').fontSize(7).text('No Img', thumbX, thumbY + 14, {
          width: thumbSize,
          align: 'center',
        });
      }

      doc.fillColor('#111').fontSize(10).text(productText, margin + 54, y + 2, { width: 210 });
      doc.text(item.size || '-', margin + 268, y + 2, { width: 40 });
      doc.text(String(item.quantity || 0), margin + 310, y + 2, { width: 34 });
      doc.text(`Rs. ${Number(item.price || 0).toFixed(2)}`, margin + 346, y + 2, { width: 74, align: 'right' });
      doc.text(`Rs. ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}`, margin + 424, y + 2, {
        width: 74,
        align: 'right',
      });

      y += rowHeight;
      doc.moveTo(margin, y).lineTo(margin + contentWidth, y).strokeColor('#eee').stroke();
      y += 6;
    }

    ensureSpace(150);
    y += 4;
    const labelX = margin + 305;
    const valueX = margin + 392;
    doc.fillColor('#333').font('Helvetica').fontSize(11);
    doc.text('Subtotal', labelX, y, { width: 120 });
    doc.text(`Rs. ${Number(order.subtotal || 0).toFixed(2)}`, valueX, y, { width: 106, align: 'right' });
    y += 18;
    doc.text('Discount', labelX, y, { width: 120 });
    doc.fillColor('#0a7d32').text(`- Rs. ${Number(order.discount || 0).toFixed(2)}`, valueX, y, { width: 106, align: 'right' });
    y += 18;
    doc.fillColor('#333').text('Shipping', labelX, y, { width: 120 });
    doc.text(`Rs. ${Number(order.shippingCost || 0).toFixed(2)}`, valueX, y, { width: 106, align: 'right' });
    y += 18;
    if (order.couponUsed?.code) {
      doc.text('Coupon', labelX, y, { width: 120 });
      doc.text(`${order.couponUsed.code} (- Rs. ${Number(order.couponUsed.discount || 0).toFixed(2)})`, valueX - 20, y, {
        width: 126,
        align: 'right',
      });
      y += 18;
    }
    doc.moveTo(labelX, y + 4).lineTo(margin + contentWidth, y + 4).strokeColor('#ddd').stroke();
    y += 10;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(12);
    doc.text('Grand Total', labelX, y, { width: 120 });
    doc.text(`Rs. ${Number(order.total || 0).toFixed(2)}`, valueX, y, { width: 106, align: 'right' });

    y += 30;
    ensureSpace(64);
    doc.fillColor('#555').font('Helvetica').fontSize(10);
    doc.text(`Payment Status: ${order.paymentStatus || '-'}`, margin, y);
    doc.text(`Order Status: ${order.orderStatus || '-'}`, margin + 170, y);
    y += 14;
    if (order.razorpayPaymentId) {
      doc.text(`Razorpay Payment ID: ${order.razorpayPaymentId}`, margin, y, { width: contentWidth });
      y += 14;
    }

    ensureSpace(24);
    y += 8;
    doc.fontSize(9).fillColor('#777').text('This is a computer-generated invoice and does not require a signature.', margin, y, {
      width: contentWidth,
      align: 'center',
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const orderNumber = await getNextOrderNumber();
    const orderData = {
      ...req.body,
      orderNumber,
      user: req.user._id,
      statusHistory: [{ status: 'pending', note: 'Order created' }]
    };
    
    const order = await Order.create(orderData);
    try {
      await sendOrderMail({ to: req.user.email, order, context: 'created' });
    } catch (emailError) {
      console.error('Order created email failed:', emailError.message);
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (order.orderStatus === status) {
      return res.status(400).json({ message: `Order already in ${status} status` });
    }
    
    order.orderStatus = status;
    order.statusHistory.push({ status, note });
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancellationReason = note;
    }
    
    await order.save();

    try {
      const populatedOrder = await Order.findById(order._id).populate('user', 'email');
      await sendOrderMail({
        to: populatedOrder?.user?.email,
        order: populatedOrder || order,
        context: 'status_updated',
      });
    } catch (emailError) {
      console.error('Order status email failed:', emailError.message);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
