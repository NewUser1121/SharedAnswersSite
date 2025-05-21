// File routes: list, download (upload will be added later)
const express = require('express');
const auth = require('../middleware/auth');
const apikey = require('../middleware/apikey');
const File = require('../models/File');

const router = express.Router();

// List files for a class (API key required)
router.get('/:classTag', apikey, async (req, res) => {
  try {
    const classTag = req.params.classTag;
    // Only allow if API key user has access
    if (!req.apiKeyDoc.classAccess.includes(classTag)) {
      return res.status(403).json({ error: 'No access to this class' });
    }
    const files = await File.find({ classTag }).select('-__v');
    res.json(files);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Download file (by fileId)
router.get('/download/:fileId', apikey, async (req, res) => {
  // Placeholder: implement GridFS streaming or S3 download here
  res.status(501).json({ error: 'Download not implemented yet' });
});

module.exports = router;
