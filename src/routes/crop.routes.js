const express = require("express");
const router = express.Router();

const cropController = require("../controllers/crop.controller");

router.post("/add", cropController.addCrop);
router.get("/", cropController.getAllCrops);
router.get("/available", cropController.getAvailableCrops);
router.put("/:id/status", cropController.updateCropStatus);

module.exports = router;
