const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Change this to a secure key in production!
const JWT_SECRET = "your_jwt_secret_key";

// Password validation helper (minimum 8 chars, at least 1 letter, 1 digit, 1 special character)
function isPasswordValid(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
}

// REGISTER endpoint
router.post('/register', async (req, res) => {
    try {
        const {
            Name,
            Email,
            Phone,
            Address,
            Password,
            UserType = ["affected"],
            Available = true,
            Community = [],
            CreationTime = Date.now()
        } = req.body;

        // Password validation
        if (!isPasswordValid(Password)) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters, including at least one letter, one number, and one special character."
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ Email });
        if (existing) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Generate unique UserID (simple approach: highest current + 1)
        const lastUser = await User.findOne({}, {}, { sort: { 'UserID': -1 } });
        const newUserID = lastUser ? lastUser.UserID + 1 : 1;

        const user = new User({
            UserID: newUserID,
            Name,
            Email,
            Phone,
            Password: hashedPassword,
            Address,
            UserType,
            Available,
            Community,
            CreationTime
        });

        await user.save();
        res.status(201).json({
            message: "Registration successful!",
            user: { UserID: user.UserID, Name: user.Name, Email: user.Email, UserType: user.UserType }
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to register user." });
    }
});

// LOGIN endpoint
router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Issue JWT token
        const token = jwt.sign(
            { UserID: user.UserID, Email: user.Email },
            JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.status(200).json({
            message: "Login successful!",
            user: { UserID: user.UserID, Name: user.Name, Email: user.Email, UserType: user.UserType },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to login." });
    }
});

module.exports = router;
