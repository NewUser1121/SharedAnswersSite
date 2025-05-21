// API key authentication middleware for class/file access
const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  const keyDoc = await ApiKey.findOne({ key: apiKey, active: true }).populate('user');
  if (!keyDoc || !keyDoc.user) return res.status(401).json({ error: 'Invalid API key' });
  // Only allow access if the API key is for the correct user and class
  if (!keyDoc.classAccess || !Array.isArray(keyDoc.classAccess) || keyDoc.classAccess.length === 0) {
    return res.status(403).json({ error: 'API key not assigned to any class' });
  }
  // If a class is required (e.g., for file/class endpoints), check access
  if (req.params.classTag && !keyDoc.classAccess.includes(req.params.classTag)) {
    return res.status(403).json({ error: 'API key does not grant access to this class' });
  }
  req.apiUser = keyDoc.user;
  req.apiKeyDoc = keyDoc;
  next();
};
