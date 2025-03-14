// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST endpoint for user registration
router.post('/register', register);

// POST endpoint for user login
router.post('/login', login);

// Profile route (protected)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    try {
        // Verify the token. If invalid, jwt.verify will throw an error.
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Update the user: set is_verified to true and remove the token
        const [updated] = await User.update(
            { is_verified: true, verification_token: null },
            { where: { email: decoded.email, verification_token: token } }
        );

        if (!updated) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
});

module.exports = router;
