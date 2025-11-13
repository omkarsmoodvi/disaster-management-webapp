const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const incidentSchema = new mongoose.Schema({
  IncidentID: { type: Number, required: true, unique: true },
  Volunteers: { type: [Number], default: [] },
  AffectedIndividual: { type: [Number], default: [] },
  ApproximateaffectedCount: { type: Number, required: true, default: 0 },
  // LocationID will be automatically set, do not send from frontend
  LocationID: { type: Number, unique: true },
  IncidentType: {
    type: String,
    enum: ['Fire', 'Flood', 'Cyclone', 'Earthquake', 'Accident', 'Others'],
    required: true
  },
  Description: { type: String, required: true },
  CommunityID: { type: Number, required: true },
  ReportedBy: { type: Number, required: true },
  DateReported: { type: Date, required: true, default: Date.now },
  Urgency: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  Status: { type: String, enum: ['Running', 'Expired', 'Resolved'], required: true, default: 'Running' },
  Location: { type: String, required: true }
});

// This line will auto-generate a unique LocationID for every new incident
incidentSchema.plugin(AutoIncrement, { inc_field: 'LocationID' });

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
