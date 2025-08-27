const express = require("express");
const router = express.Router();

// Import controller functions
const cropController = require("../controllers/crop.controller");

// Routes
router.post("/add", cropController.addCrop);   // Add a crop
router.get("/", cropController.getAllCrops);  // Get all crops

module.exports = router;
