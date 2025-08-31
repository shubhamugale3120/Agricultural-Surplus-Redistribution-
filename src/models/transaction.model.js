const db = require("../config/db");

// TransactionTable model: handles complex transactions between farmers, buyers, NGOs, and sellers
// This table tracks the complete flow: farmer sells/donates crop -> buyer/NGO receives -> seller delivers
module.exports = {
	// Create a new transaction record
	// This function handles the complex business logic of creating a transaction
	create: async ({ crop_id, farmer_id, buyer_id, ngo_id, seller_id, transaction_type, price, delivery_status }) => {
		// SQL INSERT with multiple foreign keys - this creates the transaction record
		// Note: buyer_id and ngo_id can be NULL (one or the other, not both)
		const sql = `INSERT INTO TransactionTable 
			(crop_id, farmer_id, buyer_id, ngo_id, seller_id, transaction_type, price, date, delivery_status) 
			VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`;
		
		// Parameters array - order must match the ? placeholders in SQL
		const params = [
			crop_id, 
			farmer_id, 
			buyer_id || null,  // If no buyer, set to NULL
			ngo_id || null,    // If no NGO, set to NULL
			seller_id, 
			transaction_type,  // 'commercial' or 'charity'
			price || 0,        // Default price to 0 if not provided
			delivery_status || 'pending'
		];
		
		// Execute the query and get the result
		const [result] = await db.query(sql, params);
		
		// Return the created transaction with generated ID
		return { 
			transaction_id: result.insertId, 
			crop_id, 
			farmer_id, 
			buyer_id, 
			ngo_id, 
			seller_id, 
			transaction_type, 
			price: price || 0, 
			delivery_status: delivery_status || 'pending' 
		};
	},

	// Get transaction by ID with related data
	getById: async (id) => {
		// JOIN query to get transaction details with related entity names
		// This gives us a complete picture of the transaction
		const sql = `
			SELECT t.*, 
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM TransactionTable t
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE t.transaction_id = ?
		`;
		
		const [rows] = await db.query(sql, [id]);
		return rows[0] || null; // Return first row or null if not found
	},

	// List all transactions with pagination support
	list: async (limit = 50, offset = 0) => {
		// Get transactions with related data, ordered by most recent first
		const sql = `
			SELECT t.*, 
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM TransactionTable t
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			ORDER BY t.transaction_id DESC
			LIMIT ? OFFSET ?
		`;
		
		const [rows] = await db.query(sql, [limit, offset]);
		return rows;
	},

	// Update transaction delivery status
	updateDeliveryStatus: async (id, status) => {
		// Simple UPDATE query to change delivery status
		const [result] = await db.query(
			"UPDATE TransactionTable SET delivery_status = ? WHERE transaction_id = ?", 
			[status, id]
		);
		return result.affectedRows > 0; // Returns true if record was updated
	},

	// Get transactions by type (commercial vs charity)
	getByType: async (transaction_type) => {
		const sql = `
			SELECT t.*, 
				f.name as farmer_name,
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM TransactionTable t
			LEFT JOIN Farmer f ON t.farmer_id = f.farmer_id
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE t.transaction_type = ?
			ORDER BY t.transaction_id DESC
		`;
		
		const [rows] = await db.query(sql, [transaction_type]);
		return rows;
	},

	// Get transactions by farmer (for farmer dashboard)
	getByFarmer: async (farmer_id) => {
		const sql = `
			SELECT t.*, 
				b.name as buyer_name,
				n.name as ngo_name,
				s.name as seller_name,
				c.crop_name
			FROM TransactionTable t
			LEFT JOIN Buyer b ON t.buyer_id = b.buyer_id
			LEFT JOIN NGO n ON t.ngo_id = n.ngo_id
			LEFT JOIN Seller s ON t.seller_id = s.seller_id
			LEFT JOIN Crop c ON t.crop_id = c.crop_id
			WHERE t.farmer_id = ?
			ORDER BY t.transaction_id DESC
		`;
		
		const [rows] = await db.query(sql, [farmer_id]);
		return rows;
	}
}; 