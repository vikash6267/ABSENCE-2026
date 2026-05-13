const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  commissionAmount: {
    type: Number,
    default: 0
  },
  commissionPercentage: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['pending', 'credited', 'cancelled'],
    default: 'pending'
  },
  referralType: {
    type: String,
    enum: ['product', 'user'],
    default: 'product'
  },
  creditedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
