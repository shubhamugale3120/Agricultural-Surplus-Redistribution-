const db = require("../config/db");

module.exports = {
	create: async ({ name, contact_person, phone, location, email }) => {
		const sql = "INSERT INTO NGO (name, contact_person, phone, location, email) VALUES (?, ?, ?, ?, ?)";
		const [r] = await db.query(sql, [name, contact_person, phone, location, email]);
		return { ngo_id: r.insertId, name, contact_person, phone, location, email };
	},
	list: async () => {
		const [rows] = await db.query("SELECT * FROM NGO ORDER BY ngo_id DESC");
		return rows;
	},
	getById: async (id) => {
		const [rows] = await db.query("SELECT * FROM NGO WHERE ngo_id = ?", [id]);
		return rows[0] || null;
	},
	update: async (id, { name, contact_person, phone, location, email }) => {
		const sql = "UPDATE NGO SET name=?, contact_person=?, phone=?, location=?, email=? WHERE ngo_id=?";
		const [r] = await db.query(sql, [name, contact_person, phone, location, email, id]);
		return r.affectedRows > 0;
	},
	remove: async (id) => {
		const [r] = await db.query("DELETE FROM NGO WHERE ngo_id=?", [id]);
		return r.affectedRows > 0;
	}
}; 