const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    ResourceID: {
        type: Number,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: [true, "Resource name must be provided"]
    },
    Type: {
        type: String,
        required: [true, "Resource type must be provided"],
        enum: ["food", "medicines", "clothes", "money", "volunteers", "equipment", "other"]
    },
    Quantity: {
        type: Number,
        required: [true, "Resource quantity must be provided"],
        min: [1, "Quantity must be at least 1"]
    },
    LocationID: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        required: true,
        enum: ['available', 'unavailable']
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
module.exports = Resource;
