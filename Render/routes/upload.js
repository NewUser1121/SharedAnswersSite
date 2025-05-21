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

// Add resource (file or drive link)
router.post('/resource', auth, admin, upload.single('file'), async (req, res) => {
  try {    const { classTag, subject, type, label, driveLink } = req.body;
    
    if (!classTag || !subject || !type || !label) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let resourceLink = '';
    
    if (type === 'file' && req.file) {
      // Handle file upload
      const fileDoc = new File({
        filename: req.file.filename || req.file.originalname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        classTag,
        uploader: req.user._id
      });
      await fileDoc.save();
      
      // You would implement your Google Drive upload here
      // For now, we'll use a placeholder
      resourceLink = `https://drive.google.com/file/d/${fileDoc._id}/view?usp=sharing`;
    } else if ((type === 'link' || type === 'folder') && driveLink) {
      // Use provided Drive link
      resourceLink = driveLink;
    } else {
      return res.status(400).json({ error: 'Invalid resource data' });
    }    // Update the subject page
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(__dirname, `../../Classes/${classTag}/${classTag} ${subject}.html`);

    // Verify the file exists
    try {
        await fs.access(filePath);
    } catch (err) {
        throw new Error(`${subject} page for ${classTag} grade not found`);
    }
    
    let html = await fs.readFile(filePath, 'utf8');
    
    const icon = type === 'folder' ? 'fa-folder-open' : 'fa-file-alt';
    const cardClass = type === 'folder' ? 'drive-link-card folder-link' : 'drive-link-card';
    
    const newCard = `    <a class="${cardClass}" href="${resourceLink}" target="_blank" rel="noopener">
      <i class="fas ${icon}"></i>
      ${label}
    </a>`;
    
    const insertPoint = html.lastIndexOf('folder-link');
    html = html.slice(0, insertPoint) + newCard + '\n    ' + html.slice(insertPoint);
    
    await fs.writeFile(filePath, html, 'utf8');
    
    res.status(201).json({ 
      message: 'Resource added successfully',
      link: resourceLink
    });
  } catch (err) {
    console.error('Error adding resource:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
