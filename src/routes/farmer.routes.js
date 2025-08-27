const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer.controller");

// ✅ This route will handle POST requests at /api/farmers/register
// Example: POST http://localhost:3000/api/farmers/register
router.post("/register", farmerController.registerFarmer);

// ✅ This route will handle GET requests at /api/farmers
// Example: GET http://localhost:3000/api/farmers
router.get("/", farmerController.getFarmers);

module.exports = router;
