// backend/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { initiatePayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST endpoint to initiate a payment
router.post('/initiate', initiatePayment);

// GET endpoint to fetch payment history (protected)
router.get('/history', protect, getPaymentHistory);

module.exports = router;
