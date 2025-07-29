const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { username, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  if (!user.rows.length) return res.status(401).json({ error: "Invalid user" });
console.log(user)
  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token });
}

module.exports = { login };
