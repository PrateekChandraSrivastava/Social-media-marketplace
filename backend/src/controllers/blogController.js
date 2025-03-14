// backend/src/controllers/blogController.js
const { BlogPost } = require('../models');


const addBlogPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const blogPost = await BlogPost.create({ title, content, author });
        res.status(201).json({ message: "Blog post created successfully", blogPost });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const fetchBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.findAll();
        res.status(200).json({ blogPosts });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { addBlogPost, fetchBlogPosts };
