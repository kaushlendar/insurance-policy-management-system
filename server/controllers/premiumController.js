const db = require("../db");

// ===========================
// Get All Premiums
// ===========================
const getPremiums = (req, res) => {
  const sql = `
    SELECT
      premiums.*,
      users.name AS customer_name,
      policies.policy_name
    FROM premiums
    JOIN users ON premiums.customer_id = users.id
    JOIN policies ON premiums.policy_id = policies.id
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
      premiums: result,
    });
  });
};

// ===========================
// Add Premium
// ===========================
const addPremium = (req, res) => {
  const { customer_id, policy_id, amount, payment_date, status } = req.body;

  if (!customer_id || !policy_id || !amount || !payment_date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO premiums
    (customer_id, policy_id, amount, payment_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      customer_id,
      policy_id,
      amount,
      payment_date,
      status || "Pending",
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
        message: "Premium Added Successfully",
      });
    }
  );
};

// ===========================
// Update Premium
// ===========================
const updatePremium = (req, res) => {
  const { id } = req.params;
  const { amount, payment_date, status } = req.body;

  const sql = `
    UPDATE premiums
    SET amount=?, payment_date=?, status=?
    WHERE id=?
  `;

  db.query(sql, [amount, payment_date, status, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Premium Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Premium Updated Successfully",
    });
  });
};

// ===========================
// Delete Premium
// ===========================
const deletePremium = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM premiums WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Premium Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Premium Deleted Successfully",
    });
  });
};

module.exports = {
  getPremiums,
  addPremium,
  updatePremium,
  deletePremium,
};