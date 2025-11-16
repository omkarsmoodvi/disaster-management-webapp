const mongoose = require('mongoose');

const responderContactSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['NGO', 'Hospital', 'Police'], required: true },
  email: String,
  location: String
});

const ResponderContact = mongoose.model('ResponderContact', responderContactSchema);
module.exports = ResponderContact;
