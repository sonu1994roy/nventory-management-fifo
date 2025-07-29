const pool = require('../config/db');

async function recordSale({ product_id, quantity, cost, timestamp }) {
  const res = await pool.query(
    `INSERT INTO sales (product_id, quantity, total_cost, timestamp)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [product_id, quantity, cost, timestamp]
  );
  return res.rows[0].id;
}

async function recordSaleDetail({ sale_id, batch_id, quantity, unit_price }) {
  await pool.query(
    `INSERT INTO sales_details (sale_id, batch_id, quantity, unit_price)
     VALUES ($1, $2, $3, $4)`,
    [sale_id, batch_id, quantity, unit_price]
  );
}

module.exports = { recordSale, recordSaleDetail };
