require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { createDefaultUser, deleteDefaultUser } = require("./models/userModel");
const { createTables } = require("./db/initDb");


// Allowed Origins
const allowedOrigins = [
  process.env.DOMAIN_URL,
  "http://localhost:3000",
];
// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error: Origin ${origin} not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
};


// Middleware
app.use(cors(corsOptions)); 
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true, limit: "50mb" })); 
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());


createDefaultUser();
createTables()
// deleteDefaultUser()


app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/inventoryRoutes"));



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error("Rejection:", err.message);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
});