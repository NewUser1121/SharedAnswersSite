// User routes: get/update user info
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get current user info
router.get('/me', auth, async (req, res) => {
  res.json({
    username: req.user.username,
    email: req.user.email,
    roles: req.user.roles,
    apiKey: req.user.apiKey,
    classAccess: req.user.classAccess
  });
});

// Update user info (email, password)
router.put('/me', auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email) req.user.email = email;
    if (password) req.user.password = password;
    await req.user.save();
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
