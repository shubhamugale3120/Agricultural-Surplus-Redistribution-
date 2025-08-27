// Temporary in-memory data (before DB setup)
let farmers = [];

exports.register = (req, res) => {
  const { name, location } = req.body;
  const newFarmer = { id: Date.now(), name, location };
  farmers.push(newFarmer);
  res.status(201).json({ message: "Farmer registered", farmer: newFarmer });
};

exports.getAll = (req, res) => {
  res.json(farmers);
};
