// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');

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
