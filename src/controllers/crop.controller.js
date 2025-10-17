const Crop = require("../models/crop.model");

exports.addCrop = async (req, res, next) => {
	try {
		const { farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose } = req.body;
		if (!farmer_id || !crop_name || !quantity || !unit) {
			return res.status(400).json({ message: "farmer_id, crop_name, quantity, unit are required" });
		}
		const crop = await Crop.createCrop({ farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status, purpose });
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