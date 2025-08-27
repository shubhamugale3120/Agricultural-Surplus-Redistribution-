// Temporary in-memory data (before DB setup)
// let farmers = [];

// exports.register = (req, res) => {
//   const { name, location } = req.body;
//   const newFarmer = { id: Date.now(), name, location };
//   farmers.push(newFarmer);
//   res.status(201).json({ message: "Farmer registered", farmer: newFarmer });
// };

// exports.getAll = (req, res) => {
//   res.json(farmers);
// };
const Farmer = require("../models/farmer.model");

// ========================
// 📌 Register a new farmer
// ========================
exports.registerFarmer = async (req, res) => {
  try {
    // 📥 Extract data from request body (sent by Postman / frontend)
    const { name, phone, location, email } = req.body;

    // 🚨 Validation check: All fields must be provided
    if (!name || !phone || !location || !email) {
      return res.status(400).json({ 
        error: "All fields (name, phone, location, email) are required." 
      });
    }

    // ✅ Call model function to insert into DB
    const farmer = await Farmer.createFarmer(name, phone, location, email);

    // 🎉 Send success response
    res.status(201).json({ 
      message: "Farmer registered successfully", 
      farmer 
    });

  } catch (err) {
    // ❌ Catch DB or server errors
    console.error("❌ Farmer registration error:", err); // shows in terminal

    res.status(500).json({
      error: "Internal Server Error",
      details: err.sqlMessage || err.message // show MySQL error if available
    });
  }
};

// ========================
// 📌 Get all farmers
// ========================
exports.getFarmers = async (req, res) => {
  try {
    // ✅ Call model function to fetch farmers
    const farmers = await Farmer.getAllFarmers();

    // 📤 Send result as JSON
    res.status(200).json(farmers);

  } catch (err) {
    // ❌ Handle DB errors
    console.error("❌ Fetch farmers error:", err);

    res.status(500).json({
      error: "Internal Server Error",
      details: err.sqlMessage || err.message
    });
  }
};
