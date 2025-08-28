const express = require("express");
const router = express.Router();
const ngoController = require("../controllers/ngo.controller");

router.post("/", ngoController.create);
router.get("/", ngoController.list);
router.get("/:id", ngoController.get);
router.put("/:id", ngoController.update);
router.delete("/:id", ngoController.remove);

module.exports = router; 