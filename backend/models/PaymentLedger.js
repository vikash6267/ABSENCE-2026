const mongoose = require('mongoose');

const paymentLedgerSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  transactionType: { 
    type: String, 
    enum: ['payment', 'refund', 'partial_refund'], 
    required: true 
  },
  
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  paymentGateway: { type: String, default: 'razorpay' },
  gatewayTransactionId: String,
  gatewayOrderId: String,
  gatewaySignature: String,
  
  status: { 
    type: String, 
    enum: ['success', 'failed', 'pending', 'refunded'], 
    required: true 
  },
  
  paymentMethod: String,
  
  metadata: mongoose.Schema.Types.Mixed,
  
  failureReason: String,
  refundReason: String,
  refundedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('PaymentLedger', paymentLedgerSchema);
