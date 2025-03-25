// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { register, login, getUserProfile, updateUserProfile, resendVerification } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST endpoint for user registration
router.post('/register', register);

// POST endpoint for user login
router.post('/login', login);

// Profile route (protected)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check if code matches
        if (user.verification_code !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        // Update user to verified and remove the code
        await user.update({ is_verified: true, verification_code: null });
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
});

router.post('/resend-verification', resendVerification);

module.exports = router;
