const express = require("express");
const router = express.Router();
const logisticsController = require("../controllers/logistics.controller");

// Logistics routes: handles all delivery tracking and logistics management endpoints
// These routes manage the physical delivery process from pickup to drop location

// POST /api/logistics -> Create a new logistics record for a transaction
// This endpoint is called when a transaction is created and needs delivery tracking
// Body: { transaction_id, pickup_location, drop_location, delivery_date?, status? }
router.post("/", logisticsController.create);

// GET /api/logistics -> List all logistics records with pagination
// Query params: ?page=1&limit=10 (optional)
// Returns: { logistics: [...], pagination: { page, limit, offset } }
router.get("/", logisticsController.list);

// GET /api/logistics/:id -> Get a specific logistics record by ID
// Returns: Complete logistics info with transaction and related entity details
router.get("/:id", logisticsController.getById);

// GET /api/logistics/transaction/:transaction_id -> Get logistics by transaction ID
// Returns: Logistics record for a specific transaction
// Useful for tracking delivery status of a specific transaction
router.get("/transaction/:transaction_id", logisticsController.getByTransaction);

// PUT /api/logistics/:id/status -> Update logistics status
// Body: { status: 'assigned' | 'in-progress' | 'completed' }
// Used by delivery team to update delivery progress
router.put("/:id/status", logisticsController.updateStatus);

// PUT /api/logistics/:id/delivery-date -> Update delivery date
// Body: { delivery_date: 'YYYY-MM-DD' }
// Used by logistics team to schedule delivery dates
router.put("/:id/delivery-date", logisticsController.updateDeliveryDate);

// GET /api/logistics/status/:status -> Get logistics by status
// :status can be 'assigned', 'in-progress', or 'completed'
// Useful for logistics dashboard to filter by delivery status
router.get("/status/:status", logisticsController.getByStatus);

// GET /api/logistics/seller/:seller_id -> Get logistics by seller
// Returns all logistics records assigned to a specific seller/transporter
// Used in seller dashboard to show their delivery assignments
router.get("/seller/:seller_id", logisticsController.getBySeller);

module.exports = router;
