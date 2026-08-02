const express = require("express");
const router = express.Router();

const {
  getPolicies,
  addPolicy,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");

// Get All Policies
router.get("/", getPolicies);

// Add Policy
router.post("/", addPolicy);

// Update Policy
router.put("/:id", updatePolicy);

// Delete Policy
router.delete("/:id", deletePolicy);

module.exports = router;