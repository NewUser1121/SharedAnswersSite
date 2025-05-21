// User routes: get/update user info
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
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

// List all users (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user details by ID (admin only)
router.get('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete (revoke) user by ID (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
