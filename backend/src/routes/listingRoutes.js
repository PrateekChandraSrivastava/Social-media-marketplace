// backend/src/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const { addListing, fetchListings, verifyListing, getSellerListings } = require('../controllers/listingController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');

// Endpoint to create a new listing (allowed for sellers or admins)
router.post('/', protect, sellerOrAdmin, addListing);

// Endpoint to fetch all listings (public)
router.get('/', fetchListings);

// Endpoint to verify a listing (admin-only)
router.patch('/:id/verify', protect, sellerOrAdmin, verifyListing);

// New route: Get listings for the authenticated seller (allowed for sellers or admins)
router.get('/my-listings', protect, sellerOrAdmin, getSellerListings);

module.exports = router;
