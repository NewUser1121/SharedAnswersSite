// Admin middleware (checks for admin role)
module.exports = function (req, res, next) {
  if (!req.user || !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
