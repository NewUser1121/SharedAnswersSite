// Auth routes: register, login, generate API key
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generate API key (self-service, one per user)
router.post('/generate-key', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Only allow one key per user
    let apiKey = await ApiKey.findOne({ user: user._id });
    if (!apiKey) {
      const key = crypto.randomBytes(24).toString('hex');
      apiKey = new ApiKey({ key, user: user._id, classAccess: user.classAccess });
      await apiKey.save();
      user.apiKey = key;
      await user.save();
    }
    res.json({ apiKey: apiKey.key });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
