const Crop = require("../models/crop.model");
const { emitEvent } = require("../utils/eventBus");

exports.addCrop = async (req, res, next) => {
	try {
		const { farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose, price_per_unit } = req.body;
		if (!farmer_id || !crop_name || !quantity || !unit) {
			return res.status(400).json({ message: "farmer_id, crop_name, quantity, unit are required" });
		}
		const crop = await Crop.createCrop({ farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose, price_per_unit });
		emitEvent("crop.created", crop);
		return res.status(201).json({ message: "Crop added successfully", crop });
	} catch (err) {
		next(err);
	}
};

exports.getAllCrops = async (req, res, next) => {
	try {
		const crops = await Crop.listAll();
		return res.json(crops);
	} catch (err) {
		next(err);
	}
};

exports.getAvailableCrops = async (req, res, next) => {
	try {
		const crops = await Crop.listAvailable();
		return res.json(crops);
	} catch (err) {
		next(err);
	}
};

exports.updateCropStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		if (!status) return res.status(400).json({ message: "status is required" });
		const ok = await Crop.updateStatus(id, status);
		if (!ok) return res.status(404).json({ message: "Crop not found" });
		return res.json({ message: "Status updated" });
	} catch (err) {
		next(err);
	}
};

exports.updateCropPrice = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { price_per_unit } = req.body;
		
		if (price_per_unit === undefined || price_per_unit === null) {
			return res.status(400).json({ message: "price_per_unit is required" });
		}
		
		if (price_per_unit < 0) {
			return res.status(400).json({ message: "Price cannot be negative" });
		}
		
		const ok = await Crop.updatePrice(id, price_per_unit);
		if (!ok) return res.status(404).json({ message: "Crop not found" });
		
		emitEvent("crop.price_updated", { crop_id: id, price_per_unit });
		return res.json({ message: "Price updated successfully" });
	} catch (err) {
		next(err);
	}
};

// What changed:
// Refactored to call the DB-backed model.
// Input validation and error forwarding to middleware.
// Added handlers for available crops and status updates.
// Why:
// Thin controllers: validate input → call model → return response.
// Centralized error handling keeps controllers clean.

// Always return on early responses to stop flow.
// next(err) passes errors to error middleware.

// Controllers Layer
// 📂 src/controllers/ → Business logic / handling requests.
// Controllers take data from requests, talk to models, and send responses.
// crop.controller.js
// Handles crop logic (list crops, add crop, delete crop).
// farmer.controller.js
// Handles farmer registration, profile, crop listing.
// auth.controller.js
// Handles login, signup, JWT tokens.
// 👉 Think of controllers as the brain of the operation.
// Routes → Controllers → Models