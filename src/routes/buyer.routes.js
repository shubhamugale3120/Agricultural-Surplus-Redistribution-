const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyer.controller");

// POST /api/buyers -> create buyer
router.post("/", buyerController.create);

// GET /api/buyers -> list buyers
router.get("/", buyerController.list);

// GET /api/buyers/:id -> get buyer by id
router.get("/:id", buyerController.get);

// PUT /api/buyers/:id -> update buyer
router.put("/:id", buyerController.update);

// DELETE /api/buyers/:id -> delete buyer
router.delete("/:id", buyerController.remove);

module.exports = router; 