const db = require("../db");

// ================= Dashboard Report =================

const getDashboard = (req, res) => {
  const dashboard = {};

  // Total Customers
  db.query(
    "SELECT COUNT(*) AS totalCustomers FROM users WHERE role='customer'",
    (err, customerResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      dashboard.totalCustomers = customerResult[0].totalCustomers;

      // Total Policies
      db.query(
        "SELECT COUNT(*) AS totalPolicies FROM policies",
        (err, policyResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          dashboard.totalPolicies = policyResult[0].totalPolicies;

          // Total Premiums
          db.query(
            "SELECT COUNT(*) AS totalPremiums FROM premiums",
            (err, premiumResult) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });
              }

              dashboard.totalPremiums = premiumResult[0].totalPremiums;

              // Total Claims
              db.query(
                "SELECT COUNT(*) AS totalClaims FROM claims",
                (err, claimResult) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: err.message,
                    });
                  }

                  dashboard.totalClaims = claimResult[0].totalClaims;

                  res.status(200).json({
                    success: true,
                    dashboard,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getDashboard,
};