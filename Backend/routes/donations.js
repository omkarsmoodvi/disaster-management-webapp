const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/proofs directory exists
const proofsDir = path.join(__dirname, '../../uploads/proofs');
fs.mkdirSync(proofsDir, { recursive: true });

// Set up multer for image upload (stores in uploads/proofs/)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, proofsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find({});
    res.json(donations);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch donations", details: e.message });
  }
});

// Add a new donation: works with OR without file upload
router.post('/', (req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    upload.single('proofImage')(req, res, function (err) {
      if (err) return res.status(400).json({ error: "File upload failed", details: err.message });
      next();
    });
  } else {
    next();
  }
}, async (req, res) => {
  try {
    const data = req.body;
    const doc = {
      donor: data.donor,
      type: data.type,
      item: data.item,
      quantity: data.quantity,
      usage: data.usage || 'Pending',
      transactionId: data.transactionId || "",
      proofImage: req.file ? `/api/donations/proofs/${req.file.filename}` : ""
    };
    const donation = new Donation(doc);
    await donation.save();
    res.status(201).json(donation);
  } catch (e) {
    res.status(400).json({ error: "Donation failed", details: e.message });
  }
});

// Serve uploaded proof images statically
router.use('/proofs', express.static(proofsDir));

// Edit (update) a donation by ID, supports multiple fields (usage, quantity, item, transactionId)
router.patch('/:id', async (req, res) => {
  try {
    const update = {};
    if (req.body.usage !== undefined) update.usage = req.body.usage;
    if (req.body.quantity !== undefined) update.quantity = req.body.quantity;
    if (req.body.item !== undefined) update.item = req.body.item;
    if (req.body.transactionId !== undefined) update.transactionId = req.body.transactionId;
    await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: "Donation updated" });
  } catch {
    res.status(400).json({ error: "Could not update donation" });
  }
});

// Delete a donation by ID
router.delete('/:id', async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: "Donation deleted" });
  } catch {
    res.status(400).json({ error: "Could not delete donation" });
  }
});

module.exports = router;
