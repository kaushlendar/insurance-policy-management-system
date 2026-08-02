const db = require("../db");
const bcrypt = require("bcrypt");

// ===========================
// Get All Customers
// ===========================
const getCustomers = (req, res) => {
  const sql =
    "SELECT id, name, email, phone, role, created_at FROM users WHERE role='customer'";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      customers: result,
    });
  });
};

// ===========================
// Add Customer
// ===========================
const addCustomer = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";

    db.query(
      sql,
      [name, email, phone, hashedPassword, "customer"],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "Customer Added Successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Update Customer
// ===========================
const updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const sql =
    "UPDATE users SET name=?, email=?, phone=? WHERE id=?";

  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer Updated Successfully",
    });
  });
};

// ===========================
// Delete Customer
// ===========================
const deleteCustomer = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer Deleted Successfully",
    });
  });
};

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};