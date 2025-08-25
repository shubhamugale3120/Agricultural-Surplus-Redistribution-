const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("🚀 Shubham's Backend is Running Successfully!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
