// backend/src/models/Listing.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class Listing extends Model { }

Listing.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  // New fields for selling descriptions
  short_description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  selling_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  channelDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // New fields for additional details
  revenue_sources: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_images: {
    type: DataTypes.JSON, // Using TEXT to store base64 ARRAY or a URL
    allowNull: true,
  },
  // Additional fields missing in your original model:
  monetization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  category_detail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Listing',
  tableName: 'listings',
  timestamps: true,
  underscored: true,
});

module.exports = Listing;
