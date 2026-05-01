// WebApp/Backend/server.js

require('dotenv').config(); // Always at the top!
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Static file serving (for uploads - incident images, announcement images, etc)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/dms-project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('Connected to DB'));

// Routers
app.use('/api/auth', require('./routes/auth'));                   // login/register routes
app.use('/api/incidents', require('./routes/incident'));          // incident endpoints
app.use('/api/donations', require('./routes/donations'));         // donations endpoints
app.use('/api/announcements', require('./routes/Announcements')); // <<-- this must NOT be missing!

// Default test endpoint
app.get('/', (req, res) => res.send('API running!'));

// Boot the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
