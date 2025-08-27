const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer.controller");

// Register a farmer
router.post("/register", farmerController.register);

// Get all farmers
router.get("/", farmerController.getAll);

module.exports = router;
