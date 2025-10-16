const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post("/", orderController.create);
router.get("/:id", orderController.get);
router.put("/:id/status", orderController.updateStatus);
router.get("/buyer/:buyer_id", orderController.listByBuyer);

module.exports = router; 