// 📄 src/config/db.js
// 1. Import mysql2 library in promise mode
const mysql = require("mysql2/promise");

// 2. Create a connection pool
//    - pool = multiple connections managed automatically
//    - good for APIs because many users may connect at once
const pool = mysql.createPool({
  host: "localhost",     // database host (usually localhost)
  user: "root",          // your MySQL username
  password: "Om_ugale_@701", // your MySQL password
  database: "dbms-cp", // your database name
  waitForConnections: true,   // wait instead of throwing error if busy
  connectionLimit: 10,        // max simultaneous connections
  queueLimit: 0               // 0 = unlimited queued requests
});

// 3. Export pool so models can use it
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