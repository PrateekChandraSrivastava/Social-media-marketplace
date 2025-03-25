const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Import Sequelize model

const nodemailer = require('nodemailer');




// Create a transporter (configure this with your email provider's SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service provider
    auth: {
        user: process.env.EMAIL_USER,    // set these in your .env file
        pass: process.env.EMAIL_PASS,
    },
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit code as string
};



// Function to send the verification code via email
const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code for Social Media Marketplace',
        text: `Your verification code is: ${verificationCode}`,
        html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    };
    await transporter.sendMail(mailOptions);
};

// Registration function
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            // If user exists but is not verified, resend verification code
            if (!existingUser.is_verified) {
                const verificationCode = generateVerificationCode();
                await existingUser.update({ verification_code: verificationCode });
                await sendVerificationEmail(email, verificationCode);
                return res.status(200).json({ message: 'User already registered but not verified. Verification code resent.' });
            } else {
                // If user exists and is verified, return error
                return res.status(400).json({ message: 'User already exists' });
            }
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate a 6-digit verification code
        const verificationCode = generateVerificationCode();
        // Create the user, storing the verification code
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            verification_code: verificationCode,
        });
        // Send verification code via email
        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({ message: 'Registration successful. A verification code has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Enforce email verification:
        if (!user.is_verified) {
            return res.status(400).json({ message: "You haven't completed email verification. Please complete verification by entering your verification code." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'role', 'is_verified', 'created_at'] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username;
        user.email = email;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Resend Verification Code Controller
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check if user is already verified
        if (user.is_verified) {
            return res.status(400).json({ message: 'User is already verified' });
        }
        // Generate a new verification code
        const verificationCode = generateVerificationCode();
        // Update the user with the new code
        await user.update({ verification_code: verificationCode });
        // Send the new verification code via email
        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: 'Verification code resent. Please check your email.' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
module.exports = { register, login, getUserProfile, updateUserProfile, resendVerification };
