// backend/src/config/postgres.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI, // This should be in your .env file
    // ssl: { rejectUnauthorized: false } // Uncomment if you need SSL connection (e.g., for production)
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
