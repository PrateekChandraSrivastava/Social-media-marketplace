// backend/src/controllers/listingController.js

const axios = require('axios');
const { Listing } = require('../models'); // Ensure your models are exported correctly

const API_URL = "https://www.googleapis.com/youtube/v3/";
const API_key = process.env.YOUTUBE_API_KEY; // Set in your .env

// In-memory storage for verification codes (use a persistent store in production)
const verificationCodes = new Map();

// Helper function to generate a random verification code
function generateVerificationCode(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Create a new listing
const addListing = async (req, res) => {
    try {
        const { seller_id, category, title, description, price, channelDetails, verified } = req.body;
        // Ensure channelDetails is included if available
        const listing = await Listing.create({ seller_id, category, title, description, price, channelDetails, verified });
        res.status(201).json({ message: "Listing created successfully", listing });
    } catch (error) {
        console.error("Error in addListing:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch all listings, sorted by createdAt descending
const fetchListings = async (req, res) => {
    try {
        const listings = await Listing.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({ listings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Verify a listing (update its is_verified flag)
const verifyListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        listing.is_verified = true;
        await listing.save();
        res.status(200).json({ message: "Listing verified successfully", listing });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get listings for the authenticated seller; if admin, return all listings
const getSellerListings = async (req, res) => {
    try {
        let listings;
        if (req.user.role === 'admin') {
            listings = await Listing.findAll({ order: [['createdAt', 'DESC']] });
        } else {
            listings = await Listing.findAll({
                where: { seller_id: req.user.id },
                order: [['createdAt', 'DESC']],
            });
        }
        res.status(200).json({ listings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch YouTube channel details and generate a verification code
const fetchYoutubeDetails = async (req, res) => {
    const { channelURL } = req.body;
    let channelId = '';

    // Determine channelId from URL
    if (channelURL.includes('/channel/')) {
        channelId = channelURL.split("/channel/").pop();
    } else if (channelURL.includes('/user/')) {
        const username = channelURL.split('/user/').pop();
        try {
            const response = await axios.get(`${API_URL}channels`, {
                params: {
                    part: 'id',
                    forUsername: username,
                    key: API_key
                }
            });
            if (response.data.items.length > 0) {
                channelId = response.data.items[0].id;
            } else {
                return res.status(404).json({ message: "Channel not found for this username." });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching channel by username.", error: error.message });
        }
    } else if (channelURL.includes('/@')) {
        // For handle URLs
        const handle = channelURL.split('/@').pop();
        try {
            const response = await axios.get(`${API_URL}search`, {
                params: {
                    part: 'snippet',
                    type: 'channel',
                    q: handle,
                    key: API_key
                }
            });
            if (response.data.items.length > 0) {
                channelId = response.data.items[0].id.channelId;
            } else {
                return res.status(404).json({ message: "Channel not found for this handle." });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching channel by handle.", error: error.message });
        }
    } else {
        return res.status(400).json({ message: "Invalid URL format." });
    }

    // Fetch channel details using channelId
    try {
        const response = await axios.get(`${API_URL}channels`, {
            params: {
                part: 'snippet,statistics',
                id: channelId,
                key: API_key
            }
        });
        if (response.data.items.length > 0) {
            const channelData = response.data.items[0];
            // Generate a verification code
            const code = generateVerificationCode(6);
            // Store the code in memory mapped by channelId (for demo purposes)
            verificationCodes.set(channelId, code);
            const details = {
                channelId,
                title: channelData.snippet.title,
                profilePicture: channelData.snippet.thumbnails.default.url,
                subscribers: channelData.statistics.subscriberCount,
                verificationCode: code // Include the code in the response
            };
            return res.status(200).json({ channelDetails: details });
        } else {
            return res.status(404).json({ message: "Channel not found." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching channel details.", error: error.message });
    }
};

// Verify YouTube channel by checking if the verification code exists in the channel's description
const verifyYoutubeChannel = async (req, res) => {
    let { channelId, verificationCode } = req.body;
    if (!channelId) {
        return res.status(400).json({ message: "channelId is required" });
    }

    // If no code is provided, try to get it from the stored codes in memory.
    if (!verificationCode) {
        verificationCode = verificationCodes.get(channelId);
    }

    if (!verificationCode) {
        return res.status(400).json({ message: "Verification code is required." });
    }

    try {
        const response = await axios.get(`${API_URL}channels`, {
            params: {
                part: 'snippet',
                id: channelId,
                key: API_key
            }
        });
        if (response.data.items && response.data.items.length > 0) {
            const description = response.data.items[0].snippet.description;
            if (description.includes(verificationCode)) {
                return res.status(200).json({ verified: true, message: "Channel verified successfully." });
            } else {
                return res.status(400).json({ verified: false, message: "Verification code not found in channel description." });
            }
        } else {
            return res.status(404).json({ message: "Channel not found." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error verifying channel.", error: error.message });
    }
};

module.exports = {
    addListing,
    fetchListings,
    verifyListing,
    getSellerListings,
    fetchYoutubeDetails,
    verifyYoutubeChannel
};
