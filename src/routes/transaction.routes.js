const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

// Transaction routes: handles all transaction-related API endpoints
// These routes manage the complete transaction lifecycle

// POST /api/transactions -> Create a new transaction
// This endpoint is called when an order is confirmed and needs to be converted to a transaction
// Body: { crop_id, farmer_id, buyer_id?, ngo_id?, seller_id, transaction_type, price? }
router.post("/", transactionController.create);

// GET /api/transactions -> List all transactions with pagination
// Query params: ?page=1&limit=10 (optional)
// Returns: { transactions: [...], pagination: { page, limit, offset } }
router.get("/", transactionController.list);

// GET /api/transactions/:id -> Get a specific transaction by ID
// Returns: Complete transaction with all related entity names (farmer_name, buyer_name, etc.)
router.get("/:id", transactionController.getById);

// PUT /api/transactions/:id/delivery-status -> Update delivery status
// Body: { status: 'pending' | 'in-transit' | 'delivered' }
// Used by logistics team to track delivery progress
router.put("/:id/delivery-status", transactionController.updateDeliveryStatus);

// GET /api/transactions/type/:type -> Get transactions by type
// :type can be 'commercial' or 'charity'
// Useful for filtering transactions in admin dashboard
router.get("/type/:type", transactionController.getByType);

// GET /api/transactions/farmer/:farmer_id -> Get transactions by farmer
// Returns all transactions for a specific farmer
// Used in farmer dashboard to show their transaction history
router.get("/farmer/:farmer_id", transactionController.getByFarmer);

module.exports = router;
