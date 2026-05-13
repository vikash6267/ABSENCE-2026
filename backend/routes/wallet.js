const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Referral = require('../models/Referral');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get user wallet
router.get('/', protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id })
      .populate('transactions.referralFrom', 'name email')
      .populate('transactions.order', 'orderNumber total');
    
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get referral stats
router.get('/referrals', protect, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referred', 'name email')
      .populate('product', 'name price images')
      .populate('order', 'orderNumber total orderStatus paymentMethod')
      .sort('-createdAt');
    
    const stats = {
      totalReferrals: referrals.length,
      productReferrals: referrals.filter(r => r.referralType === 'product').length,
      pendingCommission: referrals
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.commissionAmount, 0),
      totalEarned: referrals
        .filter(r => r.status === 'credited')
        .reduce((sum, r) => sum + r.commissionAmount, 0),
      referrals
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate product referral link
router.post('/product-link', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Generate referral link
    const referralLink = `${process.env.FRONTEND_URL}/product/${product.slug}?ref=${req.user._id}`;
    
    res.json({ 
      referralLink,
      productName: product.name,
      commission: '5% per sale',
      message: 'Share this link to earn commission on every purchase!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's referral code
router.get('/referral-code', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.referralCode) {
      user.referralCode = user.generateReferralCode();
      await user.save();
    }
    
    res.json({ 
      referralCode: user.referralCode,
      referralLink: `${process.env.FRONTEND_URL}/product/[slug]?ref=${user.referralCode}`,
      message: 'Share product links with your referral code to earn 5% commission!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
  try {
    // Check if it's a referral code or user ID
    let user;
    
    // First try to find by referral code
    user = await User.findOne({ referralCode: req.params.code });
    
    // If not found, try to find by user ID (for backward compatibility)
    if (!user && req.params.code.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(req.params.code);
    }
    
    if (!user) {
      return res.status(404).json({ valid: false, message: 'Invalid referral code' });
    }
    
    res.json({ 
      valid: true,
      referrerId: user._id,
      referrerName: user.name,
      referralCode: user.referralCode,
      message: `You'll get benefits from ${user.name}'s referral!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all users wallet stats
router.get('/admin/all-wallets', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const wallets = await Wallet.find({})
      .populate('user', 'name email referralCode role')
      .sort('-balance');
    
    const stats = {
      totalWallets: wallets.length,
      totalBalance: wallets.reduce((sum, w) => sum + w.balance, 0),
      totalEarned: wallets.reduce((sum, w) => sum + w.totalEarned, 0),
      totalSpent: wallets.reduce((sum, w) => sum + w.totalSpent, 0),
      wallets
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all referrals
router.get('/admin/all-referrals', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const referrals = await Referral.find({})
      .populate('referrer', 'name email referralCode')
      .populate('referred', 'name email')
      .populate('product', 'name price images')
      .populate('order', 'orderNumber total orderStatus paymentMethod')
      .sort('-createdAt');
    
    const stats = {
      totalReferrals: referrals.length,
      pendingCommission: referrals
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.commissionAmount, 0),
      creditedCommission: referrals
        .filter(r => r.status === 'credited')
        .reduce((sum, r) => sum + r.commissionAmount, 0),
      cancelledCommission: referrals
        .filter(r => r.status === 'cancelled')
        .reduce((sum, r) => sum + r.commissionAmount, 0),
      referrals
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
