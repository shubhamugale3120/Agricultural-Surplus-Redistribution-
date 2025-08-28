const Seller = require("../models/seller.model");

exports.create = async (req, res, next) => {
	try { const seller = await Seller.create(req.body); return res.status(201).json({ message: "Seller created", seller }); } catch (err) { next(err); }
};
exports.list = async (req, res, next) => { try { return res.json(await Seller.list()); } catch (err) { next(err); } };
exports.get = async (req, res, next) => { try { const d = await Seller.getById(req.params.id); if (!d) return res.status(404).json({ message: "Seller not found" }); return res.json(d); } catch (err) { next(err); } };
exports.update = async (req, res, next) => { try { const ok = await Seller.update(req.params.id, req.body); if (!ok) return res.status(404).json({ message: "Seller not found" }); return res.json({ message: "Seller updated" }); } catch (err) { next(err); } };
exports.remove = async (req, res, next) => { try { const ok = await Seller.remove(req.params.id); if (!ok) return res.status(404).json({ message: "Seller not found" }); return res.json({ message: "Seller deleted" }); } catch (err) { next(err); } }; 