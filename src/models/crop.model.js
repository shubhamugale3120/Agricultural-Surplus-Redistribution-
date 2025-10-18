const db = require("../config/db");

// Normalize status to consistent lowercase in DB ('available'|'matched'|'expired')
function normalizeStatus(status) {
    if (!status) return "available";
    const s = String(status).toLowerCase();
    if (s === "available") return "available";
    if (s === "matched" || s === "sold") return "matched";
    if (s === "expired") return "expired";
    return "available";
}

exports.createCrop = async ({ farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose, price_per_unit }) => {
    const sql = `INSERT INTO Crop (farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, purpose, status, price_per_unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [farmer_id, crop_name, quantity, unit, harvest_date, expiry_date || null, purpose || null, normalizeStatus(status), price_per_unit || null];
    const [result] = await db.query(sql, params);
    return { crop_id: result.insertId, farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, purpose: purpose || null, status: normalizeStatus(status), price_per_unit: price_per_unit || null };
};

exports.listAll = async () => {
    const [rows] = await db.query("SELECT * FROM Crop ORDER BY crop_id DESC");
    return rows;
};

exports.listAvailable = async () => {
    const [rows] = await db.query(`
        SELECT c.*, f.name as farmer_name, f.phone as farmer_phone, f.location as farmer_location 
        FROM Crop c 
        JOIN Farmer f ON c.farmer_id = f.farmer_id 
        WHERE LOWER(c.status) = 'available' 
        ORDER BY c.crop_id DESC
    `);
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
    const status = newQuantity <= 0 ? "matched" : "available";
    const [r] = await db.query("UPDATE Crop SET quantity = ?, status = ? WHERE crop_id = ?", [newQuantity, status, crop_id]);
    return r.affectedRows > 0;
};

exports.updatePrice = async (crop_id, price_per_unit) => {
    const [result] = await db.query("UPDATE Crop SET price_per_unit = ? WHERE crop_id = ?", [price_per_unit, crop_id]);
    return result.affectedRows > 0;
};