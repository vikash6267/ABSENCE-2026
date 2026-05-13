const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    size: String,
    quantity: Number,
    price: Number
  }],
  
  shippingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
  },
  
  subtotal: Number,
  discount: Number,
  shippingCost: Number,
  walletUsed: { type: Number, default: 0 },
  total: Number,
  
  couponUsed: {
    code: String,
    discount: Number
  },
  
  referralProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    commissionAmount: Number
  }],
  referralCommission: {
    totalAmount: { type: Number, default: 0 },
    credited: { type: Boolean, default: false },
    creditedAt: Date
  },
  
  paymentMethod: String,
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  
  trackingNumber: String,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
