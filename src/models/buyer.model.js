const db = require("../config/db");

// Buyer model: handles DB operations for Buyer table
module.exports = {
	// Create a new buyer
	create: async ({ name, phone, location, email, buyer_type }) => {
		// parameterized query prevents SQL injection using ? placeholders
		const sql = "INSERT INTO buyer (name, phone, location, email, buyer_type) VALUES (?, ?, ?, ?, ?)";
		const params = [name, phone, location, email, buyer_type];//accept dynamic values from url or path 
		const [result] = await db.query(sql, params);
		return { buyer_id: result.insertId, name, phone, location, email, buyer_type };
	},

	// List all buyers
	list: async () => {
		const [rows] = await db.query("SELECT * FROM buyer ORDER BY buyer_id DESC");
		return rows;
	},

	// Get a single buyer by id
	getById: async (id) => {
		const [rows] = await db.query("SELECT * FROM buyer WHERE buyer_id = ?", [id]);
		return rows[0] || null; // return first row or null
	},

	// Update buyer
	update: async (id, { name, phone, location, email, buyer_type }) => {
		const sql = "UPDATE buyer SET name=?, phone=?, location=?, email=?, buyer_type=? WHERE buyer_id=?";
		const [r] = await db.query(sql, [name, phone, location, email, buyer_type, id]);
		return r.affectedRows > 0;
	},

	// Delete buyer
	remove: async (id) => {
		const [r] = await db.query("DELETE FROM buyer WHERE buyer_id = ?", [id]);
		return r.affectedRows > 0;
	}
}; 