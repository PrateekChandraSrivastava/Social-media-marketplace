// backend/src/controllers/adminController.js
const { User } = require('../models');

const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.body; // ID of the user to promote
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the user's role to 'admin'
        await user.update({ role: 'admin' });
        res.status(200).json({ message: 'User promoted to admin successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { promoteToAdmin, getAllUsers };
