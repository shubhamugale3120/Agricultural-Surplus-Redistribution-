const express = require("express");
const router = express.Router();
const cropController = require("../controllers/crop.controller");

// Routes
router.get("/", cropController.getCrops);
router.post("/", cropController.addCrop);

module.exports = router;
