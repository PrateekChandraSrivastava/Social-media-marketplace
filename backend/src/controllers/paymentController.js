const { Payment } = require('../models'); // Import Sequelize model

const initiatePayment = async (req, res) => {
    try {
        const { buyer_id, seller_id, amount } = req.body;
        const escrow_fee = amount * 0.05;

        const payment = await Payment.create({ buyer_id, seller_id, amount, escrow_fee });

        res.status(201).json({ message: 'Payment initiated successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await Payment.findAll({
            where: { buyer_id: userId },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { initiatePayment, getPaymentHistory };
