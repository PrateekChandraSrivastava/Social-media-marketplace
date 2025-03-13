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

module.exports = router;
