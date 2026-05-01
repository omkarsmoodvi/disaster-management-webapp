const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  Content: { type: String, required: true },
  CreatedBy: { type: String, required: false },
  CreationDate: { type: Date, default: Date.now },
  Urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
  SourceType: { type: String, enum: ['admin', 'ngo', 'hospital', 'police'], required: true },
  ImageUrl: { type: String }
});

module.exports = mongoose.model('Announcement', announcementSchema);
