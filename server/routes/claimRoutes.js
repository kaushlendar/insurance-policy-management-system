const express = require("express");
const router = express.Router();

const {
  getClaims,
  addClaim,
  updateClaim,
  deleteClaim,
} = require("../controllers/claimController");

// ===========================
// Get All Claims
// GET /api/claims
// ===========================
router.get("/", getClaims);

// ===========================
// Add Claim
// POST /api/claims
// ===========================
router.post("/", addClaim);

// ===========================
// Update Claim
// PUT /api/claims/:id
// ===========================
router.put("/:id", updateClaim);

// ===========================
// Delete Claim
// DELETE /api/claims/:id
// ===========================
router.delete("/:id", deleteClaim);

module.exports = router;