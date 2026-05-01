const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: String },
  type: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  usage: { type: String, default: "Pending" },
  transactionId: { type: String },
  proofImage: { type: String }
});

module.exports = mongoose.model('Donation', donationSchema);
