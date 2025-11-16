const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const ResponderContact = require('../models/ResponderContact');
const adminOnly = require('../middleware/authAdmin');
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'disastermanagement777@gmail.com',
    pass: 'xfippuortzpgzxsx'
  }
});

const telegramBot = new TelegramBot('8357245229:AAHecox1M2QPVLH7y_TQ1KFGDKz74tya64k', { polling: false });
const TELEGRAM_ADMIN_CHAT_ID = '5318629880';

router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find({});
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch incidents' });
  }
});

router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();

    const telegramMsg =
      `🚨 INCIDENT ALERT 🚨\n` +
      `Incident ID: ${incident.IncidentID}\n` +
      `Type: ${incident.IncidentType}\n` +
      `Date: ${incident.DateReported}\n` +
      `Location: ${incident.IncidentLocation}\n` +
      `Description: ${incident.Description}\n` +
      `Urgency: ${incident.Urgency}\n` +
      `Status: ${incident.Status}\n` +
      `Reported By: ${incident.ReportedBy}\n` +
      `Reported At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    telegramBot.sendMessage(TELEGRAM_ADMIN_CHAT_ID, telegramMsg);

    (async () => {
      const contacts = await ResponderContact.find({});
      const emails = contacts.map(c => c.email);
      if (emails.length > 0) {
        await transporter.sendMail({
          from: '"DMS Alert" <disastermanagement777@gmail.com>',
          bcc: emails,
          subject: `ALERT: ${incident.IncidentType} reported!`,
          text: telegramMsg
        });
      }
    })();

    return res.status(201).json({
      incident,
      alertSummary: "Telegram and broadcast email alert sent instantly to all contacts."
    });

  } catch (err) {
    res.status(400).json({ error: err.message || 'Could not create incident' });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incident deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
