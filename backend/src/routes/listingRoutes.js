// backend/src/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const {
    addListing,
    fetchListings,
    verifyListing,
    getSellerListings,
    fetchYoutubeDetails,
    verifyYoutubeChannel
} = require('../controllers/listingController');
const { protect, sellerOrAdmin } = require('../middleware/authMiddleware');

// Create a new listing
router.post('/', protect, sellerOrAdmin, addListing);

// Fetch all listings (public)
router.get('/', fetchListings);

// Verify a listing (admin or seller)
router.patch('/:id/verify', protect, sellerOrAdmin, verifyListing);

// Get listings for the authenticated seller
router.get('/my-listings', protect, sellerOrAdmin, getSellerListings);

// Endpoints for YouTube integration
router.post('/fetch-youtube-details', protect, fetchYoutubeDetails);
router.post('/verify-youtube-channel', protect, verifyYoutubeChannel);

// Route to fetch a single listing by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await require('../models/Listing').findByPk(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }
        res.status(200).json({ listing });
    } catch (error) {
        console.error("Error fetching listing by id:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
