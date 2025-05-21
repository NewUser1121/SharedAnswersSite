// File routes: list, download (upload will be added later)
const express = require('express');
const auth = require('../middleware/auth');
const File = require('../models/File');

const router = express.Router();

// List files for a class (API key required)
router.get('/:classTag', auth, async (req, res) => {
  try {
    const classTag = req.params.classTag;
    // Only allow if user has access
    if (!req.user.classAccess.includes(classTag)) {
      return res.status(403).json({ error: 'No access to this class' });
    }
    const files = await File.find({ classTag }).select('-__v');
    res.json(files);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Download file (by fileId)
// (Assume GridFS or similar will be used for actual file streaming)
router.get('/download/:fileId', auth, async (req, res) => {
  // Placeholder: implement GridFS streaming or S3 download here
  res.status(501).json({ error: 'Download not implemented yet' });
});

module.exports = router;
