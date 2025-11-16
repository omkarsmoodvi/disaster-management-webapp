require('dotenv').config(); // Always load .env at the top!

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// --- Middleware ---
app.use(bodyParser.json());
app.use(express.json()); // Redundant with bodyParser, but harmless
app.use(cors());

// --- MongoDB Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/dms-project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database!');
});

// --- Routers: REMOVE CommunityRouter ---
const authRouter = require('./routes/AuthRouter');            // Registration/login ("/api/auth")
const incidentRouter = require('./routes/incident');
const announcementRouter = require('./routes/Announcements');
const resourceRouter = require('./routes/Resource');
const donationRouter = require('./routes/donations');
const placesRouter = require('./routes/places');              // Endpoint for hospitals/shelters, etc.

// --- Route Middleware ---
app.use('/api/auth', authRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/donations', donationRouter);
app.use('/api/places', placesRouter);

// --- Root endpoint ---
app.get('/', (req, res) => {
  res.send('API Server Running');
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
