// backend/src/models/Payment.js
const pool = require('../config/postgres');

const createPayment = async ({ buyer_id, seller_id, amount, escrow_fee }) => {
  const query = `
    INSERT INTO payments (buyer_id, seller_id, amount, escrow_fee)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [buyer_id, seller_id, amount, escrow_fee];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getPaymentHistoryByUser = async (userId) => {
  const query = `
    SELECT *
    FROM payments
    WHERE buyer_id = $1 OR seller_id = $1
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

module.exports = { createPayment, getPaymentHistoryByUser };
