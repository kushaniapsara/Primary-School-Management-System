const db = require("../config/db"); // Database connection

// Get all homework
exports.getAllHomework = (req, res) => {
  const sql = "SELECT * FROM Homework";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add new homework
exports.addHomework = (req, res) => {
  const { Homework_task, Due_date, Class_ID } = req.body; // Include Class_ID from the request
  if (!Homework_task || !Due_date || !Class_ID) {
    return res.status(400).json({ error: "Homework_task, Due_date, and Class_ID are required" });
  }

  const sql = "INSERT INTO Homework (Homework_task, Due_date, Class_ID) VALUES (?, ?, ?)";
  db.query(sql, [Homework_task, Due_date, Class_ID], (err, results) => {
    if (err) {
      console.error("Error adding homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ Homework_ID: results.insertId, Homework_task, Due_date, Class_ID });
  });
};

// Update existing homework
exports.updateHomework = (req, res) => {
  const { id } = req.params;
  const { Homework_task, Due_date, Class_ID } = req.body;
  if (!Homework_task || !Due_date || !Class_ID) {
    return res.status(400).json({ error: "Homework_task, Due_date, and Class_ID are required" });
  }

  const sql = "UPDATE Homework SET Homework = ?, Due_date = ?, Class_ID = ? WHERE Homework_ID = ?";
  db.query(sql, [Homework_task, Due_date, Class_ID, id], (err, results) => {
    if (err) {
      console.error("Error updating homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Homework updated successfully" });
  });
};

// Delete homework
exports.deleteHomework = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Homework WHERE Homework_ID = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Homework deleted successfully" });
  });
};

// Get upcoming homework (example: due within the next 7 days)
exports.getUpcomingHomework = (req, res) => {
  const sql = "SELECT * FROM Homework WHERE Due_date >= CURDATE() AND Due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching upcoming homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get recent homework (example: added within the last 7 days)
exports.getRecentHomework = (req, res) => {
  const sql = "SELECT * FROM Homework WHERE Due_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching recent homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};