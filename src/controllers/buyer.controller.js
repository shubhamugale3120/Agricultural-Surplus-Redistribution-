const Buyer = require("../models/buyer.model");

// Controller translates HTTP request -> model calls -> HTTP response
exports.create = async (req, res, next) => {
	try {
		// req.body contains JSON payload sent by client
		const { name, phone, location, email, buyer_type } = req.body;
		if (!name || !buyer_type) return res.status(400).json({ message: "name and buyer_type are required" });
		const buyer = await Buyer.create({ name, phone, location, email, buyer_type });
		return res.status(201).json({ message: "Buyer created", buyer });
	} catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
	try {
		const buyers = await Buyer.list();
		return res.json(buyers);
	} catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
	try {
		const buyer = await Buyer.getById(req.params.id);
		if (!buyer) return res.status(404).json({ message: "Buyer not found" });
		return res.json(buyer);
	} catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
	try {
		const ok = await Buyer.update(req.params.id, req.body);
		if (!ok) return res.status(404).json({ message: "Buyer not found" });
		return res.json({ message: "Buyer updated" });
	} catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
	try {
		const ok = await Buyer.remove(req.params.id);
		if (!ok) return res.status(404).json({ message: "Buyer not found" });
		return res.json({ message: "Buyer deleted" });
	} catch (err) { next(err); }
}; 