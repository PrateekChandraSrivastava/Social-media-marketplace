// backend/src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const { addBlogPost, fetchBlogPosts } = require('../controllers/blogController');

// Endpoint to create a new blog post
router.post('/', addBlogPost);

// Endpoint to fetch all blog posts
router.get('/', fetchBlogPosts);

module.exports = router;
