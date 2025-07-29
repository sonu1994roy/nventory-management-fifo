# 📦 Inventory Management System (FIFO) – Real-Time Ingestion & Live Dashboard

A full-stack inventory management tool for small trading businesses with **FIFO-based costing**, **Kafka real-time ingestion**, and **live dashboard visualization**.

---

## 🔗 Live URLs

| Service       | Link                                                         |
|---------------|--------------------------------------------------------------|
| 🌐 Frontend UI | https://nventory-management-fifo-frontend.vercel.app        |
| 🔐 Backend API | https://nventory-management-fifo.onrender.com               |
| 👤 Login       | `username: admin` / `password: password123`                 |

---
## 📦 Clone & Run (Frontend)

```bash
git clone --single-branch --branch frontend https://github.com/sonu1994roy/nventory-management-fifo.git frontend
cd frontend
npm install
# Create a `.env` file:
REACT_APP_API_BASE_URL=https://nventory-management-fifo.onrender.com/api
npm run dev

## 📦 Clone & Run (backend)
git clone --single-branch --branch backend https://github.com/sonu1994roy/nventory-management-fifo.git backend
cd backend
npm install

# Create a `.env` file:
PORT=5000
DOMAIN_URL=https://nventory-management-fifo.onrender.com
DATABASE_URL=postgresql://fifo_db_ln7z_user:dD08vXThfmJeRMRRXd6Z83kwJ70LlwnH@dpg-d2463pfdiees73adia30-a.oregon-postgres.render.com/fifo_db_ln7z
JWT_SECRET=yourSecretkey12345
npm run dev




# Note: Kafka integration is currently skipped due to the lack of free cloud resources to deploy Kafka topics without payment verification or account.
- To enable Kafka, follow these steps:

*Install Java JDK and download Kafka from *https://kafka.apache.org/

Start Zookeeper:

- C:\kafka>bin\windows\zookeeper-server-start.bat config\zookeeper.properties

Start Kafka server:

C:\kafka>java -Dlog4j.configuration=file:config\log4j.properties -cp "libs/*;." kafka.Kafka config\server.properties

*Uncomment Kafka-related code in kafka/consumer.js and *kafka/producerSimulator.js

- Add a script in package.json:

"worker": "node kafka/consumer.js"

- In a new terminal, run:

npm run worker

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
| Messaging  | Kafka (Simulated (no Kafka skipped and comment the code)) |
| Hosting    |  Render|

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
