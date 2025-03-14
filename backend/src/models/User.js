// backend/src/models/User.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize'); // your Sequelize instance

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'buyer',
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,         // pass the Sequelize instance
  modelName: 'User', // model name
  tableName: 'users',// actual table name in DB
  timestamps: true,  // if you want createdAt/updatedAt
  underscored: true,
});

module.exports = User;
