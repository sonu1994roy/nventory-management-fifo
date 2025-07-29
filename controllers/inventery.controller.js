const pool = require("../config/db");

// Get inventory summary
async function getInventory(req, res) {
  try {
    const result = await pool.query(`
      SELECT product_id,
             SUM(remaining_quantity) AS current_quantity,
             SUM(remaining_quantity * unit_price)::numeric(10,2) AS total_cost,
             (SUM(remaining_quantity * unit_price) / NULLIF(SUM(remaining_quantity), 0))::numeric(10,2) AS avg_unit_cost
      FROM inventory_batches
      GROUP BY product_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getInventory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get seles and prchase ledger
async function getLedger(req, res) {
  try {
    const [sales, purchases] = await Promise.all([
      pool.query("SELECT * FROM sales ORDER BY timestamp DESC LIMIT 20"),
      pool.query("SELECT * FROM inventory_batches ORDER BY timestamp DESC LIMIT 20"),
    ]);
    res.json({ sales: sales.rows, purchases: purchases.rows });
  } catch (error) {
    console.error("Error in getLedger:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getInventory,
  getLedger,
};
