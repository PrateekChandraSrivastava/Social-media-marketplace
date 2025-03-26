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

const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const blogPost = await BlogPost.findByPk(id);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        await blogPost.update({ title, content });
        res.status(200).json({ message: "Blog post updated successfully", blogPost });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogPost.findByPk(id);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        await blogPost.destroy();
        res.status(200).json({ message: "Blog post deleted successfully" });
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

module.exports = { addBlogPost, fetchBlogPosts, updateBlogPost, deleteBlogPost };

