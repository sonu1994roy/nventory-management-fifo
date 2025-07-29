const pool = require("../config/db");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id TEXT PRIMARY KEY
      );

      CREATE TABLE IF NOT EXISTS inventory_batches (
        id SERIAL PRIMARY KEY,
        product_id TEXT REFERENCES products(product_id),
        quantity INT NOT NULL,
        remaining_quantity INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        product_id TEXT REFERENCES products(product_id),
        quantity INT NOT NULL,
        total_cost NUMERIC(10, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW()
      );
       CREATE TABLE IF NOT EXISTS sales_details (
        id SERIAL PRIMARY KEY,
        sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
        batch_id INT REFERENCES inventory_batches(id) ON DELETE SET NULL,
        quantity INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL
      );
    `);

    console.log("Tables checked/created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = { createTables };
