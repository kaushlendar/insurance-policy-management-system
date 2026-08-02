const dashboardRoutes = require("./routes/dashboardRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Database Connection
const db = require("./db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const policyRoutes = require("./routes/policyRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const claimRoutes = require("./routes/claimRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Upload Folder Access
app.use("/uploads", express.static("uploads"));

// ================= API Routes =================

// Authentication
app.use("/api/auth", authRoutes);

// Customer Management
app.use("/api/customers", customerRoutes);

// Policy Management
app.use("/api/policies", policyRoutes);

// Premium Management
app.use("/api/premiums", premiumRoutes);

// Claim Management
app.use("/api/claims", claimRoutes);

// Document Upload
app.use("/api/documents", documentRoutes);
// Dashboard Report
app.use("/api/dashboard", dashboardRoutes);

// ================= Home Route =================

app.get("/", (req, res) => {
  res.send("🚀 Insurance Policy Management API Running...");
});

// ================= Database Test Route =================

app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Connection Failed",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Database Connected Successfully",
    });
  });
});

// ================= 404 Route =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ================= Start Server =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});