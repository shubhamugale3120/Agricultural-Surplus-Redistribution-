// // 📄 src/models/farmer.model.js
// const db = require("../config/db");

// // Create a farmer
// exports.createFarmer = async (name, phone, location, email) => {
//   // db.query() → executes SQL with placeholders (?)
//   // [result] = first item of the returned array
//   const [result] = await db.query(
//     "INSERT INTO farmers (name, phone, location, email) VALUES (?, ?)",
//     [name, phone, location, email]
//   );

//   // return new farmer object
//   return { id: result.insertId, name, phone, location, email };
// };

// // Get all farmers
// exports.getAllFarmers = async () => {
//   // rows = all farmers from DB
//   const [rows] = await db.query("SELECT * FROM Farmers");
//   return rows;
// };

const db = require("../config/db"); // import DB connection

const Farmer = {
  // ========================
  // 📌 Insert new farmer
  // ========================
  createFarmer: (name, phone, location, email) => {
    return new Promise((resolve, reject) => {
      // SQL query to insert farmer into DB
      const sql = "INSERT INTO Farmer (name, phone, location, email) VALUES (?, ?, ?, ?)";

      // Execute query
      db.query(sql, [name, phone, location, email], (err, result) => {
        if (err) {
          reject(err); // ❌ reject if error
        } else {
          // ✅ return new farmer data with generated id
          resolve({ farmer_id: result.insertId, name, phone, location, email });
        }
      });
    });
  },

  // ========================
  // 📌 Get all farmers
  // ========================
  getAllFarmers: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Farmer", (err, rows) => {
        if (err) reject(err); // ❌ reject if error
        else resolve(rows);   // ✅ return rows
      });
    });
  }
};

module.exports = Farmer;
