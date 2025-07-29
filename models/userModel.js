const pool = require("../config/db");
const bcrypt = require('bcrypt');

async function createDefaultUser() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  const existing = await pool.query("SELECT * FROM users WHERE username = 'admin'");
  if (existing.rows.length === 0) {
    //  hash  generated pasword
    const passwordHash = bcrypt.hashSync('password123', 10);
    await pool.query("INSERT INTO users (username, password) VALUES ('admin', $1)", [passwordHash]);
  }

}

async function deleteDefaultUser() {
  await pool.query("DELETE FROM users WHERE username = 'admin'");
  console.log('Deleted admin user');
}

module.exports = { createDefaultUser, deleteDefaultUser };
