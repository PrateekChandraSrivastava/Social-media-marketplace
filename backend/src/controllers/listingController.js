// backend/src/controllers/listingController.js

const axios = require('axios');
const { Listing } = require('../models');

const API_URL = "https://www.googleapis.com/youtube/v3/";
const API_key = process.env.YOUTUBE_API_KEY;

// In-memory storage for verification codes (for demo purposes)
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

// Helper function to clean URL (remove query parameters and trailing slashes)
function cleanURL(url) {
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url.split('?')[0].replace(/\/$/, '');
}

// Helper function to extract channel identifier from various YouTube URL formats
async function extractChannelId(channelURL) {
    // Check if input is already a channel ID (starts with "UC" and no "youtube.com" present)
    if (!channelURL.includes("youtube.com") && channelURL.startsWith("UC")) {
        return channelURL;
    }

    channelURL = cleanURL(channelURL);

    const channelRegex = /youtube\.com\/channel\/([^\/]+)/i;
    const userRegex = /youtube\.com\/user\/([^\/]+)/i;
    const handleRegex = /youtube\.com\/@([^\/]+)/i;

    if (channelRegex.test(channelURL)) {
        return channelURL.match(channelRegex)[1];
    } else if (userRegex.test(channelURL)) {
        const username = channelURL.match(userRegex)[1];
        const response = await axios.get(`${API_URL}channels`, {
            params: {
                part: 'id',
                forUsername: username,
                key: API_key
            }
        });
        if (response.data.items.length > 0) {
            return response.data.items[0].id;
        } else {
            throw new Error("Channel not found for this username.");
        }
    } else if (handleRegex.test(channelURL)) {
        const handle = channelURL.match(handleRegex)[1];
        const response = await axios.get(`${API_URL}search`, {
            params: {
                part: 'snippet',
                type: 'channel',
                q: handle,
                key: API_key
            }
        });
        if (response.data.items.length > 0) {
            return response.data.items[0].id.channelId;
        } else {
            throw new Error("Channel not found for this handle.");
        }
    } else {
        throw new Error("Invalid URL format.");
    }
}

// Create a new listing including the new fields

const addListing = async (req, res) => {
    try {
        const {
            seller_id,
            category,
            title,
            description,
            short_description,
            selling_description,
            price,
            channelDetails,
            verified,
            revenue_sources,
            product_images, // This should now be an array (if multiple images were sent)
            monetization,
            revenue,
            category_detail,
            reason
        } = req.body;

        const listing = await Listing.create({
            seller_id,
            category,
            title,
            description,
            short_description,
            selling_description,
            price,
            channelDetails,
            verified,
            revenue_sources,
            product_images: product_images, // Make sure the key matches your model's key "product_images"
            monetization,
            revenue,
            category_detail,
            reason
        });
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
    let channelId;
    try {
        channelId = await extractChannelId(channelURL);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

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
            const code = generateVerificationCode(6);
            verificationCodes.set(channelId, code);
            const details = {
                channelId,
                title: channelData.snippet.title,
                profilePicture: channelData.snippet.thumbnails.default.url,
                subscribers: channelData.statistics.subscriberCount,
                verificationCode: code
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
