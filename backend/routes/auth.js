const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || !phone) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

    const existsFilter = [{ phone: cleanPhone }];
    if (normalizedEmail) existsFilter.push({ email: normalizedEmail });

    const userExists = await User.findOne({ $or: existsFilter });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with phone or email' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: cleanPhone,
      password
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginIdentifier = String(identifier || email || phone || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Phone/Email and password are required' });
    }

    const byEmail = loginIdentifier.includes('@');
    const user = await User.findOne(
      byEmail
        ? { email: loginIdentifier.toLowerCase() }
        : { phone: loginIdentifier.replace(/\D/g, '') }
    );

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
