

const { Listing } = require('../models'); // Import Sequelize model

const addListing = async (req, res) => {
    try {
        const { seller_id, category, title, description, price } = req.body;
        const listing = await Listing.create({ seller_id, category, title, description, price });
        res.status(201).json({ message: "Listing created successfully", listing });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const fetchListings = async (req, res) => {
    try {
        const listings = await Listing.findAll({ order: [['created_at', 'DESC']] });
        res.status(200).json({ listings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Update the function to use Sequelize instead of raw SQL
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

// ✅ Replace raw SQL with Sequelize
const getSellerListings = async (req, res) => {
    try {
        let listings;
        // If the logged-in user is an admin, fetch all listings (or adjust as needed)
        if (req.user.role === 'admin') {
            listings = await Listing.findAll({ order: [['createdAt', 'DESC']] });
        } else {
            // For sellers, fetch only their listings
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

module.exports = { addListing, fetchListings, verifyListing, getSellerListings };
