const express = require("express");
const router = express.Router();

const {
  getPremiums,
  addPremium,
  updatePremium,
  deletePremium,
} = require("../controllers/premiumController");

// Get All Premiums
router.get("/", getPremiums);

// Add Premium
router.post("/", addPremium);

// Update Premium
router.put("/:id", updatePremium);

// Delete Premium
router.delete("/:id", deletePremium);

module.exports = router;