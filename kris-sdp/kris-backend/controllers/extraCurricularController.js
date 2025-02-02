const db = require("../config/db"); // Make sure you have a database connection

exports.getAllActivities = (req, res) => {
  const sql = "SELECT Activity_name AS name, Activity_emoji AS img FROM ExtraCurricularActivity";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    res.json(results);
  });
};


exports.addActivity = (req, res) => {
  const { name, img } = req.body;

  if (!name || !img) {
    return res.status(400).json({ message: "Activity name and emoji are required" });
  }

  const sql = "INSERT INTO ExtraCurricularActivity (Activity_name, Activity_emoji) VALUES (?, ?)";
  
  db.query(sql, [name, img], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({ message: "Activity added successfully", id: result.insertId });
  });
};
