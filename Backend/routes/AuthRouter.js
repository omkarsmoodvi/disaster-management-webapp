const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // ADD THIS - for generating verification tokens
const { sendVerificationEmail } = require('../config/emailConfig'); // ADD THIS


const JWT_SECRET = "your_jwt_secret_key"; // Do NOT use this in production


// Improved password validation: at least 8 chars, 1 letter, 1 number, 1 special char, no spaces
function isPasswordValid(password) {
    return (
        typeof password === 'string' &&
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&    // At least one letter
        /\d/.test(password) &&          // At least one digit
        /[^\w\s]/.test(password) &&     // At least one special character (non-word, non-space)
        !/\s/.test(password)            // No spaces allowed
    );
}


// ---- REGISTRATION ENDPOINT ----
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


        // ----- Role-based Email Rule -----
        const isAdmin = Array.isArray(UserType) && UserType.includes("admin");
        if (
            (isAdmin && !Email.endsWith('@admin.in')) ||
            (!isAdmin && /admin/i.test(Email))
        ) {
            return res.status(400).json({ error: isAdmin
                ? "Admin email must end with @admin.in"
                : "User email cannot contain 'admin'" });
        }


        // Password validation
        if (!isPasswordValid(Password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters, include a letter, a number, a special character and contain no spaces."
            });
        }


        // Check if user already exists
        const existing = await User.findOne({ Email });
        if (existing) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);


        // Generate unique UserID (find max)
        const lastUser = await User.findOne({}, {}, { sort: { 'UserID': -1 } });
        const newUserID = lastUser ? lastUser.UserID + 1 : 1;


        // ===== GENERATE VERIFICATION TOKEN =====
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now


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
            CreationTime,
            // ===== ADD VERIFICATION FIELDS =====
            isVerified: false,
            verificationToken: verificationToken,
            verificationTokenExpiry: verificationTokenExpiry
        });


        await user.save();


        // ===== SEND VERIFICATION EMAIL =====
        const emailSent = await sendVerificationEmail(Email, verificationToken);
        
        if (emailSent) {
            res.status(201).json({
                message: "Registration successful! Please check your email to verify your account.",
                user: { UserID: user.UserID, Name: user.Name, Email: user.Email, UserType: user.UserType }
            });
        } else {
            res.status(201).json({
                message: "Registration successful! However, verification email could not be sent. Please contact support.",
                user: { UserID: user.UserID, Name: user.Name, Email: user.Email, UserType: user.UserType }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to register user." });
    }
});


// ---- LOGIN ENDPOINT ----
router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }


        // ===== CHECK IF EMAIL IS VERIFIED =====
        if (!user.isVerified) {
            return res.status(403).json({ 
                error: "Please verify your email before logging in. Check your inbox for the verification link." 
            });
        }


        // Compare hashed passwords
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }


        // Issue JWT token with UserType for role checks
        const token = jwt.sign(
            { UserID: user.UserID, Email: user.Email, UserType: user.UserType },
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


// ===== EMAIL VERIFICATION ENDPOINT =====
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        // Find user with this verification token
        const user = await User.findOne({ 
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() } // Token must not be expired
        });
        
        if (!user) {
            return res.status(400).json({ 
                error: "Invalid or expired verification link. Please request a new one." 
            });
        }
        
        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = null; // Clear token
        user.verificationTokenExpiry = null; // Clear expiry
        await user.save();
        
        res.status(200).json({ 
            message: "Email verified successfully! You can now login." 
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to verify email." });
    }
});


module.exports = router;
