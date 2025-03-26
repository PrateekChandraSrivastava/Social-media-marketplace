// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');
const { promoteToAdmin, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); // assuming you have admin auth middleware

// New endpoint: promote a user to admin (only accessible by admin)
router.post('/promote', protect, admin, promoteToAdmin);

router.get('/users', protect, admin, getAllUsers);

// GET endpoint to retrieve all chat logs (sorted by newest first)
router.get('/chat-logs', async (req, res) => {
    try {
        const logs = await ChatLog.find().sort({ timestamp: -1 });
        res.status(200).json({ chatLogs: logs });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chat logs", error: error.message });
    }
});





module.exports = router;
