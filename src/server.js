const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");

// Import all route modules - each handles a specific entity/feature
const cropRoutes = require("./routes/crop.routes");
const farmerRoutes = require("./routes/farmer.routes");
const buyerRoutes = require("./routes/buyer.routes");
const ngoRoutes = require("./routes/ngo.routes");
const sellerRoutes = require("./routes/seller.routes");
const orderRoutes = require("./routes/order.routes");
const transactionRoutes = require("./routes/transaction.routes");
const logisticsRoutes = require("./routes/logistics.routes");
const eventsRoutes = require("./routes/events.routes");
const errorHandler = require("./middleware/error.middleware");

// Create Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

// ========================
// MIDDLEWARE CONFIGURATION
// ========================

// CORS middleware: allows frontend to make requests from different origins
// This is essential for frontend-backend communication
app.use(cors());

// JSON body parser: converts incoming JSON requests to req.body object
// This allows us to access POST/PUT data as JavaScript objects
app.use(express.json());

// Morgan logging: logs all HTTP requests to console for debugging
// Shows: method, URL, status code, response time
app.use(morgan("dev"));

// ========================
// ROOT ENDPOINT
// ========================

// Simple root endpoint to confirm server is running
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Agricultural Surplus Redistribution API is running!",
    version: "1.0.0",
    endpoints: {
      health: "GET /health/db",
      api: "GET /api/*",
      documentation: "Check comments in server.js for API details"
    }
  });
});

// ========================
// HEALTH CHECK ENDPOINT
// ========================

// Database connectivity test endpoint
// This helps verify if the server can connect to MySQL
app.get("/health/db", async (req, res) => {
  try {
    // Simple query to test database connection
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0] });
  } catch (err) {
    // If DB connection fails, return error
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ========================
// API ROUTES MOUNTING
// ========================

// Mount all entity routes under /api prefix
// Each route group handles CRUD operations for a specific entity

// Farmers: manage farmer registration and profiles
// Endpoints: POST /api/farmers/register, GET /api/farmers
app.use("/api/farmers", farmerRoutes);

// Crops: manage crop listings and availability
// Endpoints: POST /api/crops/add, GET /api/crops, GET /api/crops/available
app.use("/api/crops", cropRoutes);

// Buyers: manage buyer profiles and types
// Endpoints: POST /api/buyers, GET /api/buyers, PUT /api/buyers/:id
app.use("/api/buyers", buyerRoutes);

// NGOs: manage NGO profiles and contact information
// Endpoints: POST /api/ngos, GET /api/ngos, PUT /api/ngos/:id
app.use("/api/ngos", ngoRoutes);

// Sellers (Transporters): manage delivery personnel and vehicles
// Endpoints: POST /api/sellers, GET /api/sellers, PUT /api/sellers/:id
app.use("/api/sellers", sellerRoutes);

// Orders: manage crop orders from buyers
// Endpoints: POST /api/orders, GET /api/orders/:id, PUT /api/orders/:id/status
app.use("/api/orders", orderRoutes);

// Transactions: manage complete transaction lifecycle
// Endpoints: POST /api/transactions, GET /api/transactions, PUT /api/transactions/:id/delivery-status
app.use("/api/transactions", transactionRoutes);

// Logistics: manage delivery tracking and logistics
// Endpoints: POST /api/logistics, GET /api/logistics, PUT /api/logistics/:id/status
app.use("/api/logistics", logisticsRoutes);
// Real-time SSE stream
app.use("/api/events", eventsRoutes);

// ========================
// ERROR HANDLING
// ========================

// Global error handler: catches all errors from routes/controllers
// This ensures consistent error responses across the API
app.use(errorHandler);

// ========================
// SERVER STARTUP
// ========================

// Async function to start server only after DB connection is verified
async function start() {
  try {
    // Test database connection before starting server
    await db.query("SELECT 1");
    
    // Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health/db`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    // If DB connection fails, log error and exit
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  }
}

// Start the server
start();

// ========================
// COMPLETE API DOCUMENTATION
// ========================

/*
📚 AGRICULTURAL SURPLUS REDISTRIBUTION API DOCUMENTATION

🎯 BUSINESS PURPOSE:
This API manages the complete flow of agricultural surplus redistribution:
Farmer → Crop → Buyer/NGO → Order → Transaction → Logistics → Delivery

📋 AVAILABLE ENDPOINTS:

🔸 FARMERS (/api/farmers)
- POST /api/farmers/register - Register new farmer
- GET /api/farmers - List all farmers

🔸 CROPS (/api/crops)
- POST /api/crops/add - Add new crop listing
- GET /api/crops - List all crops
- GET /api/crops/available - List available crops only
- PUT /api/crops/:id/status - Update crop status

🔸 BUYERS (/api/buyers)
- POST /api/buyers - Create buyer profile
- GET /api/buyers - List all buyers
- GET /api/buyers/:id - Get specific buyer
- PUT /api/buyers/:id - Update buyer
- DELETE /api/buyers/:id - Delete buyer

🔸 NGOS (/api/ngos)
- POST /api/ngos - Create NGO profile
- GET /api/ngos - List all NGOs
- GET /api/ngos/:id - Get specific NGO
- PUT /api/ngos/:id - Update NGO
- DELETE /api/ngos/:id - Delete NGO

🔸 SELLERS (/api/sellers)
- POST /api/sellers - Register transporter/seller
- GET /api/sellers - List all sellers
- GET /api/sellers/:id - Get specific seller
- PUT /api/sellers/:id - Update seller
- DELETE /api/sellers/:id - Delete seller

🔸 ORDERS (/api/orders)
- POST /api/orders - Create new order
- GET /api/orders/:id - Get specific order
- PUT /api/orders/:id/status - Update order status

🔸 TRANSACTIONS (/api/transactions)
- POST /api/transactions - Create transaction from order
- GET /api/transactions - List all transactions (with pagination)
- GET /api/transactions/:id - Get specific transaction
- PUT /api/transactions/:id/delivery-status - Update delivery status
- GET /api/transactions/type/:type - Filter by commercial/charity
- GET /api/transactions/farmer/:farmer_id - Get farmer's transactions

🔸 LOGISTICS (/api/logistics)
- POST /api/logistics - Create logistics record
- GET /api/logistics - List all logistics (with pagination)
- GET /api/logistics/:id - Get specific logistics
- GET /api/logistics/transaction/:transaction_id - Get by transaction
- PUT /api/logistics/:id/status - Update delivery status
- PUT /api/logistics/:id/delivery-date - Update delivery date
- GET /api/logistics/status/:status - Filter by status
- GET /api/logistics/seller/:seller_id - Get seller's deliveries

🔸 HEALTH CHECK
- GET /health/db - Test database connectivity

📊 COMPLETE BUSINESS FLOW:

1. FARMER REGISTRATION
   POST /api/farmers/register
   Body: { name, phone, location, email }

2. CROP LISTING
   POST /api/crops/add
   Body: { farmer_id, crop_name, quantity, unit, harvest_date, expiry_date }

3. BUYER/NGO REGISTRATION
   POST /api/buyers OR POST /api/ngos
   Body: { name, phone, location, email, buyer_type }

4. ORDER CREATION
   POST /api/orders
   Body: { crop_id, buyer_id, quantity }

5. TRANSACTION CREATION
   POST /api/transactions
   Body: { crop_id, farmer_id, buyer_id, seller_id, transaction_type, price }

6. LOGISTICS ASSIGNMENT
   POST /api/logistics
   Body: { transaction_id, pickup_location, drop_location, delivery_date }

7. DELIVERY TRACKING
   PUT /api/logistics/:id/status
   Body: { status: 'assigned' | 'in-progress' | 'completed' }

🔒 SECURITY FEATURES:
- Parameterized SQL queries (prevents injection)
- Input validation in all controllers
- CORS configuration for frontend access
- Centralized error handling
- Environment-based configuration (.env)

💾 DATABASE SCHEMA:
- Farmer: farmer_id, name, phone, location, email
- Crop: crop_id, farmer_id, crop_name, quantity, unit, harvest_date, expiry_date, status
- Buyer: buyer_id, name, phone, location, email, buyer_type
- NGO: ngo_id, name, contact_person, phone, location, email
- Seller: seller_id, name, phone, vehicle_no, location, availability_status
- Orders: order_id, crop_id, buyer_id, quantity, order_date, status
- TransactionTable: transaction_id, crop_id, farmer_id, buyer_id, ngo_id, seller_id, transaction_type, price, date, delivery_status
- Logistics: logistics_id, transaction_id, pickup_location, drop_location, delivery_date, status

🚀 FRONTEND INTEGRATION:
Base URL: http://localhost:3000/api
Headers: { 'Content-Type': 'application/json' }
Example: fetch('http://localhost:3000/api/crops/available')
*/