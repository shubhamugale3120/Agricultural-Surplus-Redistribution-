const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post("/", orderController.create);
router.get("/:id", orderController.get);
router.put("/:id/status", orderController.updateStatus);

module.exports = router; 