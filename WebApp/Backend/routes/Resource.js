const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Resource Schema & Model
const ResourceSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Resource name must be provided"]
    },
    Type: {
        type: String,
        required: [true, "Resource type must be provided"],
        enum: ["food", "medicines", "clothes", "money", "volunteers", "equipment", "other"] // example types
    },
    Quantity: {
        type: Number,
        required: [true, "Resource quantity must be provided"],
        min: [1, "Resource quantity must be at least 1"]
    },
    Location: {
        type: String,
        required: [true, "Resource location must be provided"]
    },
    Assigned: {
        type: Boolean,
        default: false
    },
    CommunityID: {
        type: Number,
        default: null
    },
    CreationTime: {
        type: Date,
        default: Date.now,
        required: true
    }
});
const Resource = mongoose.model('Resource', ResourceSchema);

// GET all resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch resources' });
    }
});

// POST a new resource
router.post('/', async (req, res) => {
    try {
        const resource = new Resource({
            Name: req.body.Name,
            Type: req.body.Type,
            Quantity: req.body.Quantity,
            Location: req.body.Location,
            Assigned: req.body.Assigned,
            CommunityID: req.body.CommunityID,
            CreationTime: req.body.CreationTime || Date.now()
        });
        await resource.save();
        res.json(resource);
    } catch (err) {
        res.status(400).json({ error: err.message || 'Could not create resource' });
    }
});

module.exports = router;
