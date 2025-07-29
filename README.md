# 📦 Inventory Management System (FIFO) – Real-Time Ingestion & Live Dashboard

A full-stack inventory management tool for small trading businesses with **FIFO-based costing**, **Kafka real-time ingestion**, and **live dashboard visualization**.

---

## 🚀 Live Demo

| Platform   | URL (Replace after deployment)               |
|------------|----------------------------------------------|
| 🔐 Backend API | https://inventory-fifo-backend.onrender.com |
| 📊 Frontend UI | https://inventory-dashboard.vercel.app     |
| 👤 Login     | `username: admin` / `password: password123`     |

---

## 📌 Assignment Objective

- Inventory data flows in real-time via Kafka events
- FIFO logic determines cost per sale
- Backend stores all purchase/sale transactions
- Frontend dashboard visualizes stock + cost live
- Kafka simulator built in (UI button)

---

## ⚙️ Tech Stack

| Layer      | Stack                      |
|------------|----------------------------|
| Frontend   | React + Vite + Chart.js    |
| Backend    | Express.js (Node.js)       |
| DB         | PostgreSQL                 |
| Messaging  | Kafka (via Confluent Cloud)|
| Hosting    | Vercel (frontend) + Render (backend) |

---

## 🔁 FIFO Logic – How Cost is Calculated

**FIFO (First-In First-Out)** means:
- Sales consume the *oldest available inventory batches first*.
- Cost is calculated by summing quantity × unit price from oldest batches.

### 🔄 Example:
| Batch | Quantity | Unit Price | Timestamp         |
|-------|----------|------------|-------------------|
| 1     | 50       | ₹100       | 2025-07-10 10:00AM |
| 2     | 100      | ₹120       | 2025-07-12 12:00PM |

If a sale of **70 units** happens:
- 50 units are taken from batch 1 → ₹100 × 50 = ₹5,000  
- 20 units are taken from batch 2 → ₹120 × 20 = ₹2,400  
- ✅ **Total cost = ₹7,400**

---

## 📊 Frontend Dashboard Features

- 🔒 Basic Auth (username/password)
- 📦 Inventory Overview:
  - Product ID
  - Current Quantity
  - Total Inventory Cost
  - Average Cost/Unit
- 📜 Transaction Ledger:
  - Time-series of Purchases/Sales
  - FIFO cost calculation shown per sale
- 📈 Chart Visuals:
  - Bar charts for quantity & total cost
- 🔁 Live Refresh: auto-updates every 3 seconds
- 🧪 “Simulate Transaction” button triggers Kafka events in real-time

---

## 📡 Kafka Integration

- Topic: `inventory-events`
- Event structure:

```json
{
  "product_id": "PRD001",
  "event_type": "purchase" | "sale",
  "quantity": 50,
  "unit_price": 100.0, // only for purchase
  "timestamp": "2025-07-12T10:00:00Z"
}
