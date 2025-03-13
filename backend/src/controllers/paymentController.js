// backend/src/controllers/paymentController.js
const { createPayment, getPaymentHistoryByUser } = require('../models/Payment');

const initiatePayment = async (req, res) => {
    try {
        const { buyer_id, seller_id, amount } = req.body;
        // Calculate an escrow fee (example: 5% of the amount)
        const escrow_fee = amount * 0.05;

        // Create the payment record
        const payment = await createPayment({ buyer_id, seller_id, amount, escrow_fee });

        res.status(201).json({ message: 'Payment initiated successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id; // The user ID is set by our authentication middleware
        const history = await getPaymentHistoryByUser(userId);
        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { initiatePayment, getPaymentHistory };
