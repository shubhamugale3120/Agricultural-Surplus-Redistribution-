const db = require("../config/db");

module.exports = {
	create: async ({ crop_id, buyer_id, quantity, status }) => {
		const sql = "INSERT INTO Orders (crop_id, buyer_id, quantity, status) VALUES (?, ?, ?, ?)";
		const [r] = await db.query(sql, [crop_id, buyer_id, quantity, status || "pending"]);
		return { order_id: r.insertId, crop_id, buyer_id, quantity, status: status || "pending" };
	},
	getById: async (id) => {
		const [rows] = await db.query("SELECT * FROM Orders WHERE order_id=?", [id]);
		return rows[0] || null;
	},
	updateStatus: async (id, status) => {
		const [r] = await db.query("UPDATE Orders SET status=? WHERE order_id=?", [status, id]);
		return r.affectedRows > 0;
	}
}; 