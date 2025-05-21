// User model for MongoDB (Mongoose)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  apiKey: { type: String, unique: true },
  roles: { type: [String], default: ['user'] }, // e.g., ['user', 'admin']
  createdAt: { type: Date, default: Date.now },
  classAccess: { type: [String], default: [] } // e.g., ['10th', '11th']
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
