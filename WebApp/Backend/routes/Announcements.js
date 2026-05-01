const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const multer = require('multer');
const path = require('path');

// Adjust upload path as your directory structure
const upload = multer({ dest: path.join(__dirname, '../uploads/announcements/') });

// Dummy role-based middleware for demo (replace with real authentication in production)
function requireTrusted(req, res, next) {
  req.user = { role: 'admin' }; // <-- REPLACE in production
  if (req.user && ['admin', 'ngo', 'hospital', 'police'].includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Not authorized' });
}

// POST: Add announcement, with optional image
router.post('/', requireTrusted, upload.single('image'), async (req, res) => {
  try {
    const { Content, CreatedBy, Urgency, SourceType } = req.body;
    if (!Content || !Urgency || !SourceType) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    let ImageUrl;
    if (req.file) {
      ImageUrl = `/uploads/announcements/${req.file.filename}`;
    }
    const ann = new Announcement({ Content, CreatedBy, Urgency, SourceType, ImageUrl });
    await ann.save();
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

// GET: List announcements (public)
router.get('/', async (req, res) => {
  try {
    const anns = await Announcement.find({}).sort({ CreationDate: -1 }).limit(50);
    res.json(anns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// DELETE: Remove announcement
router.delete('/:id', requireTrusted, async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Announcement.findByIdAndDelete(_id);
    if (result) res.json({ success: true });
    else res.status(404).json({ error: 'Announcement not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
});

// PUT: Update announcement
router.put('/:id', requireTrusted, upload.single('image'), async (req, res) => {
  try {
    const { Content, CreatedBy, Urgency, SourceType } = req.body;
    let updateData = { Content, CreatedBy, Urgency, SourceType };
    if (req.file) {
      updateData.ImageUrl = `/uploads/announcements/${req.file.filename}`;
    }
    const result = await Announcement.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (result) res.json(result);
    else res.status(404).json({ error: 'Announcement not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
});

module.exports = router;
