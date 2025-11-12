const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Announcement Schema & Model
const AnnouncementSchema = new mongoose.Schema({
    Text: {
        type: String,
        required: [true, "Announcement text must be provided"]
    },
    Author: {
        type: String,
        default: "System" // could use UserID or Name if needed
    },
    Date: {
        type: Date,
        default: Date.now,
        required: true
    },
    CommunityID: {
        type: Number,
        default: null
    }
});
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

// GET all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({});
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch announcements' });
    }
});

// POST a new announcement
router.post('/', async (req, res) => {
    try {
        const announcement = new Announcement({
            Text: req.body.Text,
            Author: req.body.Author,
            Date: req.body.Date || Date.now(),
            CommunityID: req.body.CommunityID
        });
        await announcement.save();
        res.json(announcement);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Could not create announcement' });
    }
});

module.exports = router;
