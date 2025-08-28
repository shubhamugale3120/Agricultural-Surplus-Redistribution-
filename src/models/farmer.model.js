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

const db = require("../config/db");

const Farmer = {
	createFarmer: async (name, phone, location, email) => {
		const sql = "INSERT INTO Farmer (name, phone, location, email) VALUES (?, ?, ?, ?)";//Notes:
    // Use ? placeholders to prevent SQL injection.
		const params = [name, phone, location, email];
		const [result] = await db.query(sql, params);
		return { farmer_id: result.insertId, name, phone, location, email };
	},

	getAllFarmers: async () => {
		const [rows] = await db.query("SELECT * FROM Farmer ORDER BY farmer_id DESC");
		return rows;
	}
};

module.exports = Farmer;
