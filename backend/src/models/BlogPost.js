const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class BlogPost extends Model { }

BlogPost.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'BlogPost',
  tableName: 'blog_posts',
  timestamps: false, // or true if you want createdAt/updatedAt
});

module.exports = BlogPost;
