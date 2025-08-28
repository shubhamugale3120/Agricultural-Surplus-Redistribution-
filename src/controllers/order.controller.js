const Orders = require("../models/order.model");

exports.create = async (req, res, next) => {
	try { const order = await Orders.create(req.body); return res.status(201).json({ message: "Order created", order }); } catch (err) { next(err); }
};
exports.get = async (req, res, next) => { try { const o = await Orders.getById(req.params.id); if (!o) return res.status(404).json({ message: "Order not found" }); return res.json(o); } catch (err) { next(err); } };
exports.updateStatus = async (req, res, next) => { try { const ok = await Orders.updateStatus(req.params.id, req.body.status); if (!ok) return res.status(404).json({ message: "Order not found" }); return res.json({ message: "Order status updated" }); } catch (err) { next(err); } }; 