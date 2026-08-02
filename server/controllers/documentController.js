const db = require("../db");
const path = require("path");
const multer = require("multer");

// ===========================
// Multer Storage
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

// ===========================
// Get All Documents
// ===========================
const getDocuments = (req, res) => {
  const sql = `
    SELECT
      documents.*,
      users.name AS customer_name,
      policies.policy_name
    FROM documents
    JOIN users ON documents.customer_id = users.id
    JOIN policies ON documents.policy_id = policies.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      documents: result,
    });
  });
};
// ===========================
// Add Document
// ===========================
const addDocument = (req, res) => {
  const { customer_id, policy_id, document_name } = req.body;

  if (!customer_id || !policy_id || !document_name || !req.file) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const file_path = req.file.filename;

  const sql = `
    INSERT INTO documents
    (customer_id, policy_id, document_name, file_path)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_id, policy_id, document_name, file_path],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Document Uploaded Successfully",
      });
    }
  );
};

// ===========================
// Delete Document
// ===========================
const deleteDocument = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM documents WHERE id=?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Document Not Found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Document Deleted Successfully",
      });
    }
  );
};

// ===========================
// Export
// ===========================
module.exports = {
  upload,
  getDocuments,
  addDocument,
  deleteDocument,
};