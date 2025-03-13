// backend/src/controllers/listingController.js
const pool = require('../config/postgres');
const { createListing, getListings } = require('../models/Listing');

const addListing = async (req, res) => {
    try {
        const { seller_id, category, title, description, price } = req.body;
        const listing = await createListing({ seller_id, category, title, description, price });
        res.status(201).json({ message: "Listing created successfully", listing });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const fetchListings = async (req, res) => {
    try {
        const listings = await getListings();
        res.status(200).json({ listings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Optional: Endpoint for verifying a listing (e.g., by an admin)
const verifyListing = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'UPDATE listings SET is_verified = true WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json({ message: "Listing verified successfully", listing: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// New function: Get listings for the authenticated seller
const getSellerListings = async (req, res) => {
    try {
        const sellerId = req.user.id; // set by auth middleware
        const query = `
        SELECT * FROM listings
        WHERE seller_id = $1
        ORDER BY created_at DESC
      `;
        const { rows } = await pool.query(query, [sellerId]);
        res.status(200).json({ listings: rows });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addListing, fetchListings, verifyListing, getSellerListings };
