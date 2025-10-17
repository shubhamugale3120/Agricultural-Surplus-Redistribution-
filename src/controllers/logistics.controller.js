const Logistics = require("../models/logistics.model");
const Transaction = require("../models/transaction.model");
const { emitEvent } = require("../utils/eventBus");

// Logistics controller: handles delivery tracking and logistics management
// This controller manages the physical delivery process from pickup to drop

// Create a new logistics record for a transaction
exports.create = async (req, res, next) => {
	try {
		// Extract logistics data from request body
		const { transaction_id, pickup_location, drop_location, delivery_date, status } = req.body;
		
		// Validate required fields
		if (!transaction_id || !pickup_location || !drop_location) {
			return res.status(400).json({ 
				message: "transaction_id, pickup_location, and drop_location are required" 
			});
		}
		
        // Validate status if provided (project enum: 'pending' | 'in-transit' | 'delivered')
        if (status && !['pending', 'in-transit', 'delivered'].includes(String(status).toLowerCase())) {
			return res.status(400).json({ 
                message: "Status must be 'pending', 'in-transit', or 'delivered'" 
			});
		}
		
		// Create logistics record in database
		const logistics = await Logistics.create({
			transaction_id,
			pickup_location,
			drop_location,
			delivery_date,
			status
		});
		
        // Emit event and return success response
        emitEvent("logistics.created", logistics);
		return res.status(201).json({ 
			message: "Logistics record created successfully", 
			logistics 
		});
		
	} catch (err) { 
		next(err); 
	}
};

// Get logistics by ID with complete transaction details
exports.getById = async (req, res, next) => {
	try {
		const logistics = await Logistics.getById(req.params.id);
		
		// Check if logistics record exists
		if (!logistics) {
			return res.status(404).json({ message: "Logistics record not found" });
		}
		
		return res.json(logistics);
		
	} catch (err) { 
		next(err); 
	}
};

// Get logistics by transaction ID
exports.getByTransaction = async (req, res, next) => {
	try {
		const { transaction_id } = req.params;
		
		// Validate transaction_id is a number
		if (!transaction_id || isNaN(transaction_id)) {
			return res.status(400).json({ message: "Valid transaction_id required" });
		}
		
		const logistics = await Logistics.getByTransaction(parseInt(transaction_id));
		
		if (!logistics) {
			return res.status(404).json({ message: "Logistics record not found for this transaction" });
		}
		
		return res.json(logistics);
		
	} catch (err) { 
		next(err); 
	}
};

// List all logistics with pagination
exports.list = async (req, res, next) => {
	try {
		// Get pagination parameters from query string
		// Example: GET /api/logistics?page=1&limit=10
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 50;
		const offset = (page - 1) * limit;
		
		const logistics = await Logistics.list(limit, offset);
		
		return res.json({
			logistics,
			pagination: {
				page,
				limit,
				offset
			}
		});
		
	} catch (err) { 
		next(err); 
	}
};

// Update logistics status (used by delivery team)
function normalizeLogisticsStatus(input) {
    // Normalize to project enum values: 'pending' | 'in-transit' | 'delivered'
    if (!input) return "pending";
    const s = String(input).toLowerCase();
    if (s === "pending" || s === "assigned") return "pending";
    if (s === "in-transit" || s === "in transit" || s === "in-progress" || s === "in progress") return "in-transit";
    if (s === "delivered" || s === "completed") return "delivered";
    return "pending";
}

exports.updateStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
        const { status } = req.body;

        const normalized = normalizeLogisticsStatus(status);

        // Update status in database (project enum)
        const updated = await Logistics.updateStatus(id, normalized);
		
		if (!updated) {
			return res.status(404).json({ message: "Logistics record not found" });
		}

        emitEvent("logistics.status", { logistics_id: Number(id), status: normalized });

        // If logistics completed, also mark the linked transaction as delivered
        if (normalized === "delivered") {
            try {
                const details = await Logistics.getById(id);
                if (details && details.transaction_id) {
                    await Transaction.updateDeliveryStatus(details.transaction_id, 'delivered');
                    emitEvent("transaction.delivery_status", { transaction_id: details.transaction_id, status: 'delivered' });
                }
            } catch (_) { /* best-effort; ignore */ }
        }

        return res.json({ message: "Logistics status updated successfully", status: normalized });
		
	} catch (err) { 
		next(err); 
	}
};

// Update delivery date (used by logistics team)
exports.updateDeliveryDate = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { delivery_date } = req.body;
		
		// Validate delivery date format (YYYY-MM-DD)
		if (!delivery_date || !/^\d{4}-\d{2}-\d{2}$/.test(delivery_date)) {
			return res.status(400).json({ 
				message: "Valid delivery_date required in YYYY-MM-DD format" 
			});
		}
		
		// Update delivery date in database
		const updated = await Logistics.updateDeliveryDate(id, delivery_date);
		
		if (!updated) {
			return res.status(404).json({ message: "Logistics record not found" });
		}
		
		return res.json({ message: "Delivery date updated successfully" });
		
	} catch (err) { 
		next(err); 
	}
};

// Get logistics by status (for logistics dashboard)
exports.getByStatus = async (req, res, next) => {
	try {
		const { status } = req.params;
		
		// Validate status
		if (!['assigned', 'in-progress', 'completed'].includes(status)) {
			return res.status(400).json({ 
				message: "Status must be 'assigned', 'in-progress', or 'completed'" 
			});
		}
		
		const logistics = await Logistics.getByStatus(status);
		return res.json(logistics);
		
	} catch (err) { 
		next(err); 
	}
};

// Get logistics by seller (for seller dashboard)
exports.getBySeller = async (req, res, next) => {
	try {
		const { seller_id } = req.params;
		
		// Validate seller_id is a number
		if (!seller_id || isNaN(seller_id)) {
			return res.status(400).json({ message: "Valid seller_id required" });
		}
		
		const logistics = await Logistics.getBySeller(parseInt(seller_id));
		return res.json(logistics);
		
	} catch (err) { 
		next(err); 
	}
};
