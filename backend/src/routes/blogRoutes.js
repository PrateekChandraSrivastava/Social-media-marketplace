const express = require('express');
const router = express.Router();
const { addBlogPost, fetchBlogPosts, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware'); // assume you protect these endpoints

// Create a blog post (accessible to authenticated users)
router.post('/', protect, addBlogPost);

// Fetch all blog posts (public)
router.get('/', fetchBlogPosts);

// Update a blog post (only the author or admin could be allowed)
router.put('/:id', protect, updateBlogPost);

// Delete a blog post (only the author or admin could be allowed)
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;
