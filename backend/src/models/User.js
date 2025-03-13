// backend/src/models/User.js
const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

const createUser = async ({ username, email, password, role = 'buyer' }) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const values = [username, email, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
};

module.exports = { createUser, findUserByEmail };
