const pool = require('../config/db');

async function createProduct(productId) {
  await pool.query('INSERT INTO products(product_id) VALUES($1) ON CONFLICT DO NOTHING', [productId]);
}

async function seedProducts() {
  const products = ['PRD001', 'PRD002', 'PRD003', 'PRD004', 'PRD005'];
  for (const pid of products) {
    await createProduct(pid);
  }
  return products;
}

module.exports = { createProduct, seedProducts };
