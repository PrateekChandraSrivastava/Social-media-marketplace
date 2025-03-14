// backend/src/models/index.js
const sequelize = require('../config/sequelize');

// Import Sequelize models from individual files
const User = require('./User');
const Payment = require('./Payment');
const Listing = require('./Listing');
const BlogPost = require('./BlogPost');

// If your model files export the model directly (i.e., module.exports = User),
// then you can aggregate them as follows:
module.exports = {
    sequelize,
    User,
    Payment,
    Listing,
    BlogPost,
};
