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

// Function to send a verification email
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - Social Media Marketplace',
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
    });
};

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token (you can use JWT or any unique string)
        const verificationToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const user = await User.create({ username, email, password: hashedPassword, role, verification_token: verificationToken });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Registration successful. A verification email has been sent.' });
    } catch (error) {
        console.error("Registration error:", error);
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

module.exports = { register, login, getUserProfile, updateUserProfile };
