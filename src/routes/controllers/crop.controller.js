// Crop controller handles crop-related logic

exports.getCrops = (req, res) => {
  res.json({ message: "List of crops will be returned here" });
};

exports.addCrop = (req, res) => {
  const crop = req.body;
  res.status(201).json({ message: "Crop added successfully", crop });
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