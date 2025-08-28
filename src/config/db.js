require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: Object.prototype.hasOwnProperty.call(process.env, "DB_PASS") ? process.env.DB_PASS : "",
  database: process.env.DB_NAME || "dbms-cp",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;





// Config Layer
// 📂 src/config/db.js
// Handles database connection (MongoDB, PostgreSQL, etc).
// Runs once when server starts.
// Example:
// const mongoose = require("mongoose");
// mongoose.connect(process.env.MONGO_URI);
// 👉 Controllers → Models → DB (through this connection).

//  Project Config Files
// package.json → Keeps dependencies (express, mongoose, etc).
// .eslintrc.json / eslint.config.js → Coding style & linting rules.
// .prettierrc → Formatting (tabs, quotes, spacing).