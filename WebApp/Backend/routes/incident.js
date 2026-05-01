const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Incident = require('../models/Incident');
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');

require('dotenv').config(); // <-- ADD THIS IF NOT PRESENT

// Multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Nodemailer ---

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// -- Telegram -- (not polling needed for notifications)
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

// --- Main POST Route ---
router.post('/', upload.single('IncidentImage'), async (req, res) => {
  try {
    // Validation block...
    const requiredFields = [
      'ReportedBy', 'IncidentType', 'IncidentLocation',
      'Description', 'Status', 'Urgency', 'DateReported'
    ];
    const missing = requiredFields.filter(
      field => !req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')
    );
    if (missing.length > 0) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    if (!req.file) return res.status(400).json({ error: 'Incident image is required (field: IncidentImage)' });

    // Prepare and save incident
    const incidentData = {
      ...req.body,
      ReportedBy: Number(req.body.ReportedBy),
      Location: req.body.Location || req.body.IncidentLocation,
      DateReported: req.body.DateReported ? new Date(req.body.DateReported) : undefined,
      ImageURL: req.file.filename
    };
    const incident = new Incident(incidentData);
    await incident.save();

    // === TELEGRAM NOTIFICATION ===
    let telegramNotifySuccess = false, telegramNotifyErr = "";
    if (process.env.TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      try {
        await telegramBot.sendPhoto(
          TELEGRAM_ADMIN_CHAT_ID,
          fs.readFileSync(path.join('uploads', req.file.filename)),
          {
            caption: `🚨 *New Incident Reported!*\nType: ${incident.IncidentType}\nLocation: ${incident.IncidentLocation}\nUrgency: *${incident.Urgency}*\nStatus: ${incident.Status}\nReportedBy: ${incident.ReportedBy}\n\n${incident.Description}`,
            parse_mode: "Markdown"
          }
        );
        telegramNotifySuccess = true;
      } catch (err) {
        console.log("Telegram notification error:", err);
        telegramNotifyErr = err.message || err;
      }
    }

    // === EMAIL NOTIFICATION ===
    let emailNotifySuccess = false, emailNotifyErr = "";
    if (process.env.NOTIFY_EMAILS) {
      try {
        await transporter.sendMail({
          from: `"Disaster Management Platform" <${process.env.EMAIL_USER}>`,
          to: process.env.NOTIFY_EMAILS,
          subject: `🚨 New Incident Reported: ${incident.IncidentType} [${incident.Urgency}]`,
          text: `
A new incident was reported:

Type: ${incident.IncidentType}
Location: ${incident.IncidentLocation}
Urgency: ${incident.Urgency}
Date: ${new Date(incident.DateReported).toLocaleString()}
Status: ${incident.Status}
Description: ${incident.Description}
Reported By (ID): ${incident.ReportedBy}
          `,
          attachments: [{
            filename: req.file.filename,
            path: path.join('uploads', req.file.filename)
          }]
        });
        emailNotifySuccess = true;
      } catch (err) {
        console.log("Email notification error:", err);
        emailNotifyErr = err.message || err;
      }
    }

    // Respond with DB object and notification feedback for debugging
    res.status(201).json({
      message: 'Incident received, saved, and notifications sent!',
      incident,
      telegramNotify: telegramNotifySuccess ? "Sent" : "Failed: " + telegramNotifyErr,
      emailNotify: emailNotifySuccess ? "Sent" : "Failed: " + emailNotifyErr
    });
  } catch (err) {
    console.log('INCIDENT POST ERROR:', err);
    res.status(400).json({ error: err.message || 'Could not create incident' });
  }
});

router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find({});
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch incidents' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incident deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
