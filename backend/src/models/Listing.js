// backend/src/models/Listing.js
const pool = require('../config/postgres');

const createListing = async ({ seller_id, category, title, description, price }) => {
    const query = `
    INSERT INTO listings (seller_id, category, title, description, price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
    const values = [seller_id, category, title, description, price];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getListings = async () => {
    const query = 'SELECT * FROM listings ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
};

module.exports = { createListing, getListings };
