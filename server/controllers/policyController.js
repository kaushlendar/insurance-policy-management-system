const db = require("../db");

// ===========================
// Get All Policies
// ===========================
const getPolicies = (req, res) => {
  const sql = "SELECT * FROM policies";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      policies: result,
    });
  });
};

// ===========================
// Add Policy
// ===========================
const addPolicy = (req, res) => {
  const { policy_name, policy_type, premium, duration, description } = req.body;

  if (!policy_name || !policy_type || !premium || !duration) {
    return res.status(400).json({
      success: false,
      message: "All required fields are mandatory",
    });
  }

  const sql = `
    INSERT INTO policies
    (policy_name, policy_type, premium, duration, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [policy_name, policy_type, premium, duration, description],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Policy Added Successfully",
      });
    }
  );
};

// ===========================
// Update Policy
// ===========================
const updatePolicy = (req, res) => {
  const { id } = req.params;
  const { policy_name, policy_type, premium, duration, description } = req.body;

  const sql = `
    UPDATE policies
    SET policy_name=?, policy_type=?, premium=?, duration=?, description=?
    WHERE id=?
  `;

  db.query(
    sql,
    [policy_name, policy_type, premium, duration, description, id],
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
          message: "Policy Not Found",
        });
      }

      res.json({
        success: true,
        message: "Policy Updated Successfully",
      });
    }
  );
};

// ===========================
// Delete Policy
// ===========================
const deletePolicy = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM policies WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Policy Not Found",
      });
    }

    res.json({
      success: true,
      message: "Policy Deleted Successfully",
    });
  });
};

module.exports = {
  getPolicies,
  addPolicy,
  updatePolicy,
  deletePolicy,
};