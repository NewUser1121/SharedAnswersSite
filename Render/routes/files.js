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

// Update Biology page content
router.post('/update-biology', auth, async (req, res) => {
  try {
    const { grade, type, label, link } = req.body;
    const filePath = `../../Classes/${grade}/${grade} Biology.html`;
    
    // Read current file
    const fs = require('fs').promises;
    let html = await fs.readFile(filePath, 'utf8');
    
    // Create new resource card
    const icon = type === 'folder' ? 'fa-folder-open' : 'fa-file-alt';
    const cardClass = type === 'folder' ? 'drive-link-card folder-link' : 'drive-link-card';
    const newCard = `    <a class="${cardClass}" href="${link}" target="_blank" rel="noopener">
      <i class="fas ${icon}"></i>
      ${label}
    </a>`;
    
    // Insert before the "View All" link
    const insertPoint = html.lastIndexOf('folder-link');
    html = html.slice(0, insertPoint) + newCard + '\n    ' + html.slice(insertPoint);
    
    // Save updated file
    await fs.writeFile(filePath, html, 'utf8');
    
    res.json({ message: 'Biology page updated successfully' });
  } catch (err) {
    console.error('Error updating Biology page:', err);
    res.status(500).json({ error: 'Failed to update Biology page' });
  }
});

module.exports = router;
