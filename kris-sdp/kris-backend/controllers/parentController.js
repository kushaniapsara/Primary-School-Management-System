const Parent = require("../models/Parent");

exports.getParents = (req, res) => {
  Parent.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching parents" });
    res.json(results);
  });
};
