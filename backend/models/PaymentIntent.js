const mongoose = require('mongoose');

const paymentIntentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    customer: {
      name: String,
      email: String,
      phone: String,
    },
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],
    subtotal: Number,
    discount: Number,
    shippingCost: Number,
    total: Number,
    couponUsed: {
      code: String,
      discount: Number,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    status: {
      type: String,
      enum: ['clicked', 'gateway_order_created', 'paid', 'failed'],
      default: 'clicked',
    },
    failureReason: String,
    source: { type: String, default: 'checkout' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentIntent', paymentIntentSchema);
