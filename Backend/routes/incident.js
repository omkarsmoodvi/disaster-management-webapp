const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// GET all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find({});
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch incidents' });
  }
});

// POST a new incident
router.post('/', async (req, res) => {
  try {
    console.log("REQ.BODY RECEIVED:", req.body);
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Could not create incident' });
  }
});

// DELETE an incident by MongoDB ObjectID (_id)
router.delete('/:id', async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incident deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;

