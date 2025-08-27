// Crop controller handles crop-related logic

// Temporary in-memory crop list (no DB yet)
let crops = [];

// Add a new crop
exports.addCrop = (req, res) => {
  const { name, quantity } = req.body;
  const newCrop = { id: Date.now(), name, quantity };
  crops.push(newCrop);

  res.status(201).json({
    message: "✅ Crop added successfully!",
    crop: newCrop,
  });
};

// Get all crops
exports.getAllCrops = (req, res) => {
  res.json(crops);
};



// Controllers Layer
// 📂 src/controllers/ → Business logic / handling requests.
// Controllers take data from requests, talk to models, and send responses.
// crop.controller.js
// Handles crop logic (list crops, add crop, delete crop).
// farmer.controller.js
// Handles farmer registration, profile, crop listing.
// auth.controller.js
// Handles login, signup, JWT tokens.
// 👉 Think of controllers as the brain of the operation.
// Routes → Controllers → Models