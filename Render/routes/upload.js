// File upload endpoint (admin only)
const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const File = require('../models/File');

const router = express.Router();

// Use multer for file uploads (store in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file (admin only)
router.post('/upload', auth, admin, upload.single('file'), async (req, res) => {
  try {
    const { classTag } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!classTag) return res.status(400).json({ error: 'classTag required' });
    // Save file metadata (actual file storage can be GridFS or S3)
    const fileDoc = new File({
      filename: req.file.filename || req.file.originalname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      classTag,
      uploader: req.user._id
    });
    await fileDoc.save();
    res.status(201).json({ message: 'File uploaded', file: fileDoc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
