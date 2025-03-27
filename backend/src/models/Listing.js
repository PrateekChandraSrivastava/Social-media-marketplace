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
}, {
  sequelize,
  modelName: 'Listing',
  tableName: 'listings',
  timestamps: true,
  underscored: true,
});

module.exports = Listing;
