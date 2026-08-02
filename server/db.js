const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "insurance_db",
});

// Connect Database
db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
    process.exit(1);
  }

  console.log("✅ MySQL Connected Successfully");
});

// Export Connection
module.exports = db;