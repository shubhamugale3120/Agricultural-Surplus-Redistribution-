const Transaction = require("../models/transaction.model");

// Transaction controller: handles the complex business logic of creating and managing transactions
// This is where orders get converted into actual transactions with logistics

// Create a new transaction (this happens when an order is confirmed)
exports.create = async (req, res, next) => {
	try {
		// Extract transaction data from request body
		const { crop_id, farmer_id, buyer_id, ngo_id, seller_id, transaction_type, price } = req.body;
		
		// Business logic validation: must have either buyer OR NGO, not both
		if (!buyer_id && !ngo_id) {
			return res.status(400).json({ 
				message: "Either buyer_id or ngo_id is required" 
			});
		}
		
		if (buyer_id && ngo_id) {
			return res.status(400).json({ 
				message: "Cannot have both buyer_id and ngo_id" 
			});
		}
		
		// Required fields validation
		if (!crop_id || !farmer_id || !seller_id || !transaction_type) {
			return res.status(400).json({ 
				message: "crop_id, farmer_id, seller_id, and transaction_type are required" 
			});
		}
		
		// Validate transaction type
		if (!['commercial', 'charity'].includes(transaction_type)) {
			return res.status(400).json({ 
				message: "transaction_type must be 'commercial' or 'charity'" 
			});
		}
		
		// Create the transaction in database
		const transaction = await Transaction.create({
			crop_id, 
			farmer_id, 
			buyer_id, 
			ngo_id, 
			seller_id, 
			transaction_type, 
			price: price || 0
		});
		
		// Return success response with created transaction
		return res.status(201).json({ 
			message: "Transaction created successfully", 
			transaction 
		});
		
	} catch (err) { 
		next(err); // Pass error to error middleware
	}
};

// Get a specific transaction by ID with all related data
exports.getById = async (req, res, next) => {
	try {
		const transaction = await Transaction.getById(req.params.id);
		
		// Check if transaction exists
		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}
		
		return res.json(transaction);
		
	} catch (err) { 
		next(err); 
	}
};

// List all transactions with pagination
exports.list = async (req, res, next) => {
	try {
		// Get pagination parameters from query string
		// Example: GET /api/transactions?page=1&limit=10
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 50;
		const offset = (page - 1) * limit; // Calculate offset for pagination
		
		const transactions = await Transaction.list(limit, offset);
		
		return res.json({
			transactions,
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

// Update transaction delivery status
exports.updateDeliveryStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		
		// Validate status
		if (!status || !['pending', 'in-transit', 'delivered'].includes(status)) {
			return res.status(400).json({ 
				message: "Valid status required: 'pending', 'in-transit', or 'delivered'" 
			});
		}
		
		// Update the status in database
		const updated = await Transaction.updateDeliveryStatus(id, status);
		
		if (!updated) {
			return res.status(404).json({ message: "Transaction not found" });
		}
		
		return res.json({ message: "Delivery status updated successfully" });
		
	} catch (err) { 
		next(err); 
	}
};

// Get transactions by type (commercial vs charity)
exports.getByType = async (req, res, next) => {
	try {
		const { type } = req.params; // Get type from URL parameter
		
		// Validate transaction type
		if (!['commercial', 'charity'].includes(type)) {
			return res.status(400).json({ 
				message: "Type must be 'commercial' or 'charity'" 
			});
		}
		
		const transactions = await Transaction.getByType(type);
		return res.json(transactions);
		
	} catch (err) { 
		next(err); 
	}
};

// Get transactions by farmer (for farmer dashboard)
exports.getByFarmer = async (req, res, next) => {
	try {
		const { farmer_id } = req.params;
		
		// Validate farmer_id is a number
		if (!farmer_id || isNaN(farmer_id)) {
			return res.status(400).json({ message: "Valid farmer_id required" });
		}
		
		const transactions = await Transaction.getByFarmer(parseInt(farmer_id));
		return res.json(transactions);
		
	} catch (err) { 
		next(err); 
	}
};
