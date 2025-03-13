// backend/src/models/ChatLog.js
const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    sender: { type: String, required: true }, // You can store socket ID or user ID here
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
