const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");

// Dashboard Report
router.get("/", getDashboard);

module.exports = router;