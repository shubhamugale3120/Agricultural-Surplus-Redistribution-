const express = require("express");
const cropRoutes = require("./routes/crop.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount routes
app.use("/api/crops", cropRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// 1️⃣ Entry Point
// 📄 src/server.js
// Main file that starts the server.
// Initializes Express, connects middleware, mounts routes.
// Think of it as the traffic police at the main gate:
// Receives all requests → sends them to correct routes.