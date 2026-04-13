const Razorpay = require('razorpay');
const crypto = require('crypto');

// Only initialize if keys are present
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

const createOrder = async (amount, currency = 'INR', receipt) => {
  if (!razorpay) {
    throw new Error('Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file');
  }
  const options = {
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt
  };
  return await razorpay.orders.create(options);
};

const verifySignature = (orderId, paymentId, signature) => {
  const text = orderId + '|' + paymentId;
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  return generated === signature;
};

module.exports = { razorpay, createOrder, verifySignature };
