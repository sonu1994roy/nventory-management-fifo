const pool = require('../config/db');

async function addInventoryBatch({ product_id, quantity, unit_price, timestamp }) {
  await pool.query(
    `INSERT INTO inventory_batches (product_id, quantity, remaining_quantity, unit_price, timestamp)
     VALUES ($1, $2, $2, $3, $4)`,
    [product_id, quantity, unit_price, timestamp]
  );
}

async function getOldestBatches(product_id) {
  const res = await pool.query(
    `SELECT * FROM inventory_batches
     WHERE product_id = $1 AND remaining_quantity > 0
     ORDER BY timestamp ASC`,
    [product_id]
  );
  return res.rows;
}

async function updateBatchQuantity(batch_id, new_quantity) {
  await pool.query(
    `UPDATE inventory_batches SET remaining_quantity = $1 WHERE id = $2`,
    [new_quantity, batch_id]
  );
}

module.exports = { addInventoryBatch, getOldestBatches, updateBatchQuantity };
