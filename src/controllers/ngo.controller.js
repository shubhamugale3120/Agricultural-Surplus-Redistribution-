const NGO = require("../models/ngo.model");

exports.create = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) return res.status(400).json({ message: "name is required" });
		const ngo = await NGO.create(req.body);
		return res.status(201).json({ message: "NGO created", ngo });
	} catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
	try { return res.json(await NGO.list()); } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
	try {
		const ngo = await NGO.getById(req.params.id);
		if (!ngo) return res.status(404).json({ message: "NGO not found" });
		return res.json(ngo);
	} catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
	try {
		const ok = await NGO.update(req.params.id, req.body);
		if (!ok) return res.status(404).json({ message: "NGO not found" });
		return res.json({ message: "NGO updated" });
	} catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
	try {
		const ok = await NGO.remove(req.params.id);
		if (!ok) return res.status(404).json({ message: "NGO not found" });
		return res.json({ message: "NGO deleted" });
	} catch (err) { next(err); }
}; 