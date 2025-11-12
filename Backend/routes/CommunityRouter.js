const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Community Schema & Model (include type, details, users: can be UserID or other type)
const CommunitySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Community name must be provided"]
    },
    Type: {
        type: String,
        required: [true, "Community type must be provided"],
        enum: ['admin', 'volunteer', 'donor', 'affected', 'public', 'private'] // sample types
    },
    Details: {
        type: String,
        required: [true, "Community details must be provided"]
    },
    Users: {
        type: [Number], // storing UserIDs as array of numbers, matching your advanced User schema
        default: []
    },
    CreationTime: {
        type: Date,
        default: Date.now,
        required: true
    }
});
const Community = mongoose.model('Community', CommunitySchema);

// GET all communities
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find({});
        res.json(communities);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch communities' });
    }
});

// POST a new community
router.post('/', async (req, res) => {
    try {
        const community = new Community({
            Name: req.body.Name,
            Type: req.body.Type,
            Details: req.body.Details,
            Users: req.body.Users,
            CreationTime: req.body.CreationTime || Date.now()
        });
        await community.save();
        res.json(community);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Could not create community' });
    }
});

module.exports = router;
