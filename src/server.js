const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");
const cropRoutes = require("./routes/crop.routes");
const farmerRoutes = require("./routes/farmer.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check: DB connectivity
app.get("/health/db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Mount routes
app.use("/api/crops", cropRoutes);
app.use("/api/farmers", farmerRoutes);

app.use(errorHandler);

async function start() {
  try {
    await db.query("SELECT 1");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  }
}

start();


// Why:
// CORS allows frontend to call API.
// Morgan logs requests for debugging.
// Health check quickly verifies DB credentials.
// Fail-fast startup avoids a “server is up but DB dead” state.



// 1️⃣ Entry Point
// 📄 src/server.js
// Main file that starts the server.
// Initializes Express, connects middleware, mounts routes.
// Think of it as the traffic police at the main gate:
// Receives all requests → sends them to correct routes.