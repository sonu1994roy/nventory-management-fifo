require('dotenv').config();
const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB Connected:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('DB Connection Error:', err);
    process.exit(1);
  }
})();
