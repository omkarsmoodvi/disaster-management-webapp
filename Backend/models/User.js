const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    UserID: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: [true, "Name must be provided"]
    },
    Email: {
        type: String,
        required: [true, "Email must be provided"],
        unique: true,
        validate: [
            {
                validator: function (value) {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/.test(value);
                },
                message: 'Email must be valid'
            },
            {
                validator: function (value) {
                    // Check allowed domains
                    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'admin.in'];
                    const emailDomain = value.split('@')[1];
                    
                    if (!allowedDomains.includes(emailDomain)) {
                        return false;
                    }
                    
                    // Admin email validation
                    if (Array.isArray(this.UserType) && this.UserType.includes("admin")) {
                        return value.endsWith('@admin.in');
                    }
                    return !/admin/i.test(value);
                },
                message: function (props) {
                    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'admin.in'];
                    const emailDomain = props.value.split('@')[1];
                    
                    if (!allowedDomains.includes(emailDomain)) {
                        return `Only emails from ${allowedDomains.join(', ')} are allowed`;
                    }
                    
                    if (Array.isArray(this.UserType) && this.UserType.includes("admin")) {
                        return "Admin email must end with '@admin.in'";
                    }
                    return "User email cannot contain 'admin'";
                }
            }
        ]
    },
    Phone: {
        type: String,
        required: [true, "Phone Number must be provided"],
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value);
            },
            message: 'Phone number must contain exactly 10 digits'
        }
    },
    Password: {
        type: String,
        required: [true, "Password must be provided"]
        // REMOVED ALL VALIDATION HERE - Password validated in AuthRouter BEFORE hashing
    },
    Address: {
        type: String,
        required: [true, "Address must be provided"]
    },
    UserType: {
        type: [String],
        required: [true, "UserType must be provided"],
        default: ["affected"],
        enum: {
            values: ["admin", "volunteer", "donor", "affected"],
            message: `UserType is not supported`
        }
    },
    Available: {
        type: Boolean,
        required: [true, "Availability must be provided"]
    },
    Community: {
        type: [Number]
    },
    CreationTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    // ===== NEW FIELDS FOR EMAIL VERIFICATION =====
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpiry: {
        type: Date,
        default: null
    }
});


module.exports = mongoose.model('User', UserSchema);
 