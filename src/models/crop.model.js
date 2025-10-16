const db = require("../config/db");

// Normalize status to consistent casing in DB (store as 'Available'|'Matched'|'Expired')
function normalizeStatus(status) {
    if (!status) return "Available";
    const s = String(status).toLowerCase();
    if (s === "available") return "Available";
    if (s === "matched" || s === "sold") return "Matched";
    if (s === "expired") return "Expired";
    return "Available";
}

exports.createCrop = async ({ farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose }) => {
    const sql = `INSERT INTO Crop (farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, purpose, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [farmer_id, crop_name, quantity, unit, harvest_date, expiry_date || null, purpose || null, normalizeStatus(status)];
    const [result] = await db.query(sql, params);
    return { crop_id: result.insertId, farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, purpose: purpose || null, status: normalizeStatus(status) };
};

exports.listAll = async () => {
    const [rows] = await db.query("SELECT * FROM Crop ORDER BY crop_id DESC");
    return rows;
};

exports.listAvailable = async () => {
    const [rows] = await db.query("SELECT * FROM Crop WHERE LOWER(status) = 'available' ORDER BY crop_id DESC");
    return rows;
};

exports.updateStatus = async (crop_id, status) => {
    const [result] = await db.query("UPDATE Crop SET status = ? WHERE crop_id = ?", [normalizeStatus(status), crop_id]);
    return result.affectedRows > 0;
};

exports.getById = async (crop_id) => {
    const [rows] = await db.query("SELECT * FROM Crop WHERE crop_id = ?", [crop_id]);
    return rows[0] || null;
};

exports.updateQuantityAndStatus = async (crop_id, newQuantity) => {
    const status = newQuantity <= 0 ? "Matched" : "Available";
    const [r] = await db.query("UPDATE Crop SET quantity = ?, status = ? WHERE crop_id = ?", [newQuantity, status, crop_id]);
    return r.affectedRows > 0;
};