const nodemailer = require('nodemailer');

// Create email transporter using Gmail credentials from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address (set in .env)
        pass: process.env.EMAIL_PASS   // Gmail App Password (not main password)
    }
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
    const verificationUrl = `http://localhost:3000/verify/${verificationToken}`; // Change to your production URL as needed
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - Disaster Management System',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to Disaster Management System!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #2563eb; 
                              color: white; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              display: inline-block;">
                        Verify Email
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
                <p style="color: #ef4444; margin-top: 20px;">
                    <strong>Note:</strong> This verification link will expire in 24 hours.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">
                    If you didn't create an account, please ignore this email.
                </p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail };
