const db = require("../db");

// ===========================
// Get All Claims
// ===========================
const getClaims = (req, res) => {
  const sql = `
    SELECT
      claims.*,
      users.name AS customer_name,
      policies.policy_name
    FROM claims
    JOIN users ON claims.customer_id = users.id
    JOIN policies ON claims.policy_id = policies.id
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
      claims: result,
    });
  });
};

// ===========================
// Add Claim
// ===========================
const addClaim = (req, res) => {
  const {
    customer_id,
    policy_id,
    claim_amount,
    claim_date,
    status,
    description,
  } = req.body;
  if (
  !customer_id ||
  !policy_id ||
  !claim_amount ||
  !claim_date
) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}

  const sql = `
    INSERT INTO claims
    (customer_id, policy_id, claim_amount, claim_date, status, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customer_id,
      policy_id,
      claim_amount,
      claim_date,
      status,
      description,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Claim Added Successfully",
      });
    }
  );
};

// ===========================
// Update Claim
// ===========================
const updateClaim = (req, res) => {
  const { id } = req.params;

  const {
    claim_amount,
    claim_date,
    status,
    description,
  } = req.body;

  const sql = `
    UPDATE claims
    SET claim_amount=?, claim_date=?, status=?, description=?
    WHERE id=?
  `;

  db.query(
    sql,
    [claim_amount, claim_date, status, description, id],
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
          message: "Claim Not Found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Claim Updated Successfully",
      });
    }
  );
};

// ===========================
// Delete Claim
// ===========================
const deleteClaim = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM claims WHERE id=?",
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
          message: "Claim Not Found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Claim Deleted Successfully",
      });
    }
  );
};

module.exports = {
  getClaims,
  addClaim,
  updateClaim,
  deleteClaim,
};