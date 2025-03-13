// backend/src/models/BlogPost.js
const pool = require('../config/postgres');

const createBlogPost = async ({ title, content, author }) => {
    const query = `
    INSERT INTO blog_posts (title, content, author)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
    const values = [title, content, author];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getBlogPosts = async () => {
    const query = 'SELECT * FROM blog_posts ORDER BY published_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

module.exports = { createBlogPost, getBlogPosts };
