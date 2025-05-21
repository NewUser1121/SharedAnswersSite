// File model for MongoDB (Mongoose)
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  classTag: { type: String, required: true }, // e.g., '10th', '11th', etc.
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now },
  // If using GridFS, store file id reference
  gridFsId: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('File', fileSchema);
