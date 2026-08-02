const express = require("express");
const router = express.Router();

const {
  upload,
  getDocuments,
  addDocument,
  deleteDocument,
} = require("../controllers/documentController");

// ===========================
// Get All Documents
// GET /api/documents
// ===========================
router.get("/", getDocuments);

// ===========================
// Upload Document
// POST /api/documents
// ===========================
router.post("/", upload.single("document"), addDocument);

// ===========================
// Delete Document
// DELETE /api/documents/:id
// ===========================
router.delete("/:id", deleteDocument);

module.exports = router;