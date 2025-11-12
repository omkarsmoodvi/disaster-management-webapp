const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/dms-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to the database!');
});

// Routers
const incidentRouter = require('./routes/incident');
const communityRouter = require('./routes/CommunityRouter');
const announcementRouter = require('./routes/Announcements');
const resourceRouter = require('./routes/Resource');
const authRouter = require('./routes/AuthRouter');
const donationRouter = require('./routes/donations'); // <---- donations route

// Route Middleware
app.use('/auth', authRouter); // Registration/login
app.use('/api/incidents', incidentRouter);
app.use('/api/communities', communityRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/donations', donationRouter); // <---- donations API

// Root endpoint
app.get('/', (req, res) => {
    res.send('API Server Running');
});

// Server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
