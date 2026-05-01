const express = require('express');
const router = express.Router();
require('dotenv').config();
const Donation = require('../models/Donation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const adminOnly = require('../middleware/authAdmin');

// Ensure uploads/donations directory exists
const donationsDir = path.join(__dirname, '../../uploads/donations');
fs.mkdirSync(donationsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, donationsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Razorpay keys missing!" });
  }
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount required!" });
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: "Failed to create Razorpay order", details: err.message });
  }
});

router.post('/verify-and-record', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donor, amount } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature === razorpay_signature) {
      const donation = new Donation({
        donor: donor || "Anonymous",
        type: "Money",
        item: "Online Payment (Razorpay)",
        quantity: amount,
        usage: "Verified",
        transactionId: `${razorpay_order_id}|${razorpay_payment_id}`,
        proofImage: ""
      });
      await donation.save();
      return res.json({ success: true, message: "Payment verified & donation logged!", donation });
    } else {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (err) {
    res.status(500).json({ error: "Payment verification failed", details: err.message });
  }
});

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

router.use('/proofs', express.static(donationsDir));

router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find({});
    res.json(donations);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch donations", details: e.message });
  }
});

router.patch('/:id', adminOnly, async (req, res) => {
  try {
    const update = {};
    if (req.body.usage !== undefined) update.usage = req.body.usage;
    if (req.body.quantity !== undefined) update.quantity = req.body.quantity;
    if (req.body.item !== undefined) update.item = req.body.item;
    if (req.body.transactionId !== undefined) update.transactionId = req.body.transactionId;
    const updated = await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: "Donation updated", updated });
  } catch {
    res.status(400).json({ error: "Could not update donation" });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: "Donation deleted" });
  } catch {
    res.status(400).json({ error: "Could not delete donation" });
  }
});

module.exports = router;
