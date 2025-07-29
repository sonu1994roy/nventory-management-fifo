const express = require("express");
const { getLedger,getInventory } = require("../controllers/inventery.controller");
const { sendRandomEvent } = require("../kafka/producerSimulator");
const router = express.Router();
const pool = require('../config/db');

const auth = require("../middlewares/auth");


router.get("/inventory", auth,getInventory);

router.get("/ledger", auth, getLedger);


// event simulation route

router.post("/simulate", auth, async (req, res) => {
  try {
    const event = await sendRandomEvent();
    res.json({ success: true, event });
  } catch (err) {
    console.error("Simulate Error:", err);
    res.status(500).json({ error: "Failed to send Kafka event" });
  }
});

router.get("/sales-details", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT s.id AS sale_id, s.product_id, sd.quantity, sd.unit_price, b.timestamp AS batch_time
    FROM sales_details sd
    JOIN sales s ON s.id = sd.sale_id
    JOIN inventory_batches b ON b.id = sd.batch_id
    ORDER BY s.id DESC, b.timestamp ASC
  `);
  res.json(result.rows);
});


module.exports = router;
