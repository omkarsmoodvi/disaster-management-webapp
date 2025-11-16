const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const incidentSchema = new mongoose.Schema({
  IncidentID: { type: Number, unique: true },
  Volunteers: { type: [Number], default: [] },
  IncidentLocation: { type: String, required: true },
  Location: { type: String, required: true },
  IncidentType: {
    type: String,
    enum: [
      'Accident',
      'Fire',
      'Flood',
      'Cyclone',
      'Earthquake',
      'Medical',
      'Riot',
      'Others'
    ],
    required: true
  },
  CustomType: { type: String, default: "" },
  Description: { type: String, required: true },
  ReportedBy: { type: Number, required: true },
  DateReported: { type: Date, required: true, default: Date.now },
  Urgency: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  Status: { type: String, enum: ['Running', 'Expired', 'Resolved'], required: true, default: 'Running' }
});

incidentSchema.plugin(AutoIncrement, { inc_field: 'IncidentID', start_seq: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
