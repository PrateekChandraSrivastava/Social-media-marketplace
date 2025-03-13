// backend/src/controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/User');
const pool = require('../config/postgres');

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create the new user
        const user = await createUser({ username, email, password, role });
        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Set by the auth middleware
        const query = 'SELECT id, username, email, role, is_verified, created_at FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // set by auth middleware
        const { username, email } = req.body;
        // You can extend this to update other fields if needed.
        const query = `
        UPDATE users
        SET username = $1, email = $2
        WHERE id = $3
        RETURNING id, username, email, role, is_verified, created_at
      `;
        const { rows } = await pool.query(query, [username, email, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login, getUserProfile, updateUserProfile };
