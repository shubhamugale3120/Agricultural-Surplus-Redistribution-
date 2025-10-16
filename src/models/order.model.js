const db = require("../config/db");

module.exports = {
    create: async ({ crop_id, buyer_id, quantity, status }) => {
        const sql = "INSERT INTO orders (crop_id, buyer_id, quantity, status) VALUES (?, ?, ?, ?)";
        const [r] = await db.query(sql, [crop_id, buyer_id, quantity, status || "Pending"]);
        return { order_id: r.insertId, crop_id, buyer_id, quantity, status: status || "Pending" };
    },
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM orders WHERE order_id=?", [id]);
        return rows[0] || null;
    },
    updateStatus: async (id, status) => {
        const [r] = await db.query("UPDATE orders SET status=? WHERE order_id=?", [status, id]);
        return r.affectedRows > 0;
    },
    listByBuyer: async (buyer_id) => {
        const sql = `SELECT o.*, c.crop_name, c.unit FROM orders o JOIN Crop c ON o.crop_id = c.crop_id WHERE o.buyer_id = ? ORDER BY o.order_id DESC`;
        const [rows] = await db.query(sql, [buyer_id]);
        return rows;
    }
};