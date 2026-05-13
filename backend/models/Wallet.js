const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    referralFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalEarned: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Method to add credit
walletSchema.methods.addCredit = function(amount, description, referralFrom, order) {
  this.balance += amount;
  this.totalEarned += amount;
  this.transactions.push({
    type: 'credit',
    amount,
    description,
    referralFrom,
    order,
    status: 'completed'
  });
  return this.save();
};

// Method to deduct amount
walletSchema.methods.deduct = function(amount, description, order) {
  if (this.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  this.balance -= amount;
  this.totalSpent += amount;
  this.transactions.push({
    type: 'debit',
    amount,
    description,
    order,
    status: 'completed'
  });
  return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);
