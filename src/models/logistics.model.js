const db = require("../config/db");

// Logistics model: handles delivery tracking and logistics management
// This table tracks the physical delivery of crops from pickup to drop location

module.exports = {
	// Create a new logistics record for a transaction
	// This is called when a transaction is created and needs delivery tracking
	create: async ({ transaction_id, pickup_location, drop_location, delivery_date, status }) => {
		// SQL INSERT to create logistics record
		// transaction_id links to TransactionTable
		const sql = `INSERT INTO Logistics 
			(transaction_id, pickup_location, drop_location, delivery_date, status) 
			VALUES (?, ?, ?, ?, ?)`;
		
		// Parameters array - order matches ? placeholders
		const params = [
			transaction_id,
			pickup_location,
			drop_location,
			delivery_date || null, // Can be null if date not set yet
			status || 'assigned'    // Default status when created
		];
		
		// Execute query and get result
		const [result] = await db.query(sql, params);
		
		// Return created logistics record
		return {
			logistics_id: result.insertId,
			transaction_id,
			pickup_location,
			drop_location,
			delivery_date: delivery_date || null,
			status: status || 'assigned'
		};
	},

	// Get logistics by ID with transaction details
	getById: async (id) => {
		// JOIN query to get logistics with transaction and related data
		// This gives complete delivery information
		const sql = `
			SELECT l.*, 
				t.transaction_type,
				t.delivery_status as transaction_delivery_status,
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM Logistics l
			JOIN TransactionTable t ON l.transaction_id = t.transaction_id
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE l.logistics_id = ?
		`;
		
		const [rows] = await db.query(sql, [id]);
		return rows[0] || null;
	},

	// Get logistics by transaction ID
	getByTransaction: async (transaction_id) => {
		// Get logistics record for a specific transaction
		const sql = `
			SELECT l.*, 
				t.transaction_type,
				t.delivery_status as transaction_delivery_status
			FROM Logistics l
			JOIN TransactionTable t ON l.transaction_id = t.transaction_id
			WHERE l.transaction_id = ?
		`;
		
		const [rows] = await db.query(sql, [transaction_id]);
		return rows[0] || null;
	},

	// List all logistics with pagination
	list: async (limit = 50, offset = 0) => {
		// Get all logistics records with related transaction data
		const sql = `
			SELECT l.*, 
				t.transaction_type,
				t.delivery_status as transaction_delivery_status,
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM Logistics l
			JOIN TransactionTable t ON l.transaction_id = t.transaction_id
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			ORDER BY l.logistics_id DESC
			LIMIT ? OFFSET ?
		`;
		
		const [rows] = await db.query(sql, [limit, offset]);
		return rows;
	},

	// Update logistics status
	updateStatus: async (id, status) => {
		// Update the delivery status
		const [result] = await db.query(
			"UPDATE Logistics SET status = ? WHERE logistics_id = ?",
			[status, id]
		);
		return result.affectedRows > 0;
	},

	// Update delivery date
	updateDeliveryDate: async (id, delivery_date) => {
		// Update the scheduled delivery date
		const [result] = await db.query(
			"UPDATE Logistics SET delivery_date = ? WHERE logistics_id = ?",
			[delivery_date, id]
		);
		return result.affectedRows > 0;
	},

	// Get logistics by status (for logistics dashboard)
	getByStatus: async (status) => {
		// Get all logistics records with a specific status
		const sql = `
			SELECT l.*, 
				t.transaction_type,
				t.delivery_status as transaction_delivery_status,
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM Logistics l
			JOIN TransactionTable t ON l.transaction_id = t.transaction_id
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE l.status = ?
			ORDER BY l.logistics_id DESC
		`;
		
		const [rows] = await db.query(sql, [status]);
		return rows;
	},

	// Get logistics by seller (for seller dashboard)
	getBySeller: async (seller_id) => {
		// Get all logistics records assigned to a specific seller
		const sql = `
			SELECT l.*, 
				t.transaction_type,
				t.delivery_status as transaction_delivery_status,
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM Logistics l
			JOIN TransactionTable t ON l.transaction_id = t.transaction_id
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE t.seller_id = ?
			ORDER BY l.logistics_id DESC
		`;
		
		const [rows] = await db.query(sql, [seller_id]);
		return rows;
	}
};
