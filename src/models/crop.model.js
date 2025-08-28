const db = require("../config/db");

exports.createCrop = async ({ farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status }) => {
	const sql = `INSERT INTO Crop (farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status)
		VALUES (?, ?, ?, ?, ?, ?, ?)`;
	const params = [farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status || "available"];
	const [result] = await db.query(sql, params);
	return { crop_id: result.insertId, farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status: status || "available" };
};

exports.listAll = async () => {
	const [rows] = await db.query("SELECT * FROM Crop ORDER BY crop_id DESC");
	return rows;
};

exports.listAvailable = async () => {
	const [rows] = await db.query("SELECT * FROM Crop WHERE status = 'available' ORDER BY crop_id DESC");
	return rows;
};

exports.updateStatus = async (crop_id, status) => {
	const [result] = await db.query("UPDATE Crop SET status = ? WHERE crop_id = ?", [status, crop_id]);
	return result.affectedRows > 0;
};