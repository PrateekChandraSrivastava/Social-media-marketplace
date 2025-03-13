// backend/src/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const { addListing, fetchListings, verifyListing, getSellerListings } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
// Endpoint to create a new listing
router.post('/', addListing);

// Endpoint to fetch all listings
router.get('/', fetchListings);

// Optional: Endpoint to verify a listing (e.g., by admin)
// Send a PATCH request to /api/listings/:id/verify
router.patch('/:id/verify', verifyListing);

// New route: Get listings for the authenticated seller
router.get('/my-listings', protect, getSellerListings);



module.exports = router;
