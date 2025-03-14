// backend/src/config/sequelize.js
const { Sequelize } = require('sequelize');

// Use environment variables for configuration
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
    logging: false, // disable logging; set to console.log to enable
});

module.exports = sequelize;
