const express = require("express");
const router = express.Router();

const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// ===========================
// Get All Customers
// GET /api/customers
// ===========================
router.get("/", getCustomers);

// ===========================
// Add Customer
// POST /api/customers
// ===========================
router.post("/", addCustomer);

// ===========================
// Update Customer
// PUT /api/customers/:id
// ===========================
router.put("/:id", updateCustomer);

// ===========================
// Delete Customer
// DELETE /api/customers/:id
// ===========================
router.delete("/:id", deleteCustomer);

module.exports = router;