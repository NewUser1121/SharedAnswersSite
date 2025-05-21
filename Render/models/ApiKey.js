// API Key model for MongoDB (Mongoose)
const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional: for expiring keys
  classAccess: { type: [String], default: [] }, // e.g., ['10th', '11th']
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
