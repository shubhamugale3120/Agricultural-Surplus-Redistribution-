const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller.controller");

router.post("/", sellerController.create);
router.get("/", sellerController.list);
router.get("/:id", sellerController.get);
router.put("/:id", sellerController.update);
router.delete("/:id", sellerController.remove);

module.exports = router; 