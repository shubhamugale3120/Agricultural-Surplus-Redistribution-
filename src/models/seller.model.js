const db = require("../config/db");

module.exports = {
	create: async ({ name, phone, vehicle_no, location, availability_status }) => {
		const sql = "INSERT INTO Seller (name, phone, vehicle_no, location, availability_status) VALUES (?, ?, ?, ?, ?)";
		const [r] = await db.query(sql, [name, phone, vehicle_no, location, availability_status || "available"]);
		return { seller_id: r.insertId, name, phone, vehicle_no, location, availability_status: availability_status || "available" };
	},
	list: async () => {
		const [rows] = await db.query("SELECT * FROM Seller ORDER BY seller_id DESC");
		return rows;
	},
	getById: async (id) => {
		const [rows] = await db.query("SELECT * FROM Seller WHERE seller_id=?", [id]);
		return rows[0] || null;
	},
	update: async (id, data) => {
		const sql = "UPDATE Seller SET name=?, phone=?, vehicle_no=?, location=?, availability_status=? WHERE seller_id=?";
		const { name, phone, vehicle_no, location, availability_status } = data;
		const [r] = await db.query(sql, [name, phone, vehicle_no, location, availability_status, id]);
		return r.affectedRows > 0;
	},
	remove: async (id) => {
		const [r] = await db.query("DELETE FROM Seller WHERE seller_id=?", [id]);
		return r.affectedRows > 0;
	}
}; 