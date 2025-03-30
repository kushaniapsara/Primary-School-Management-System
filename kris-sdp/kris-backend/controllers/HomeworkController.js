const HomeworkModel = require("../models/HomeworkModel");

// Get all homework
exports.getAllHomework = (req, res) => {
  HomeworkModel.getAllHomework((err, results) => {
    if (err) {
      console.error("Error fetching all homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add new homework
exports.addHomework = (req, res) => {
  const { Homework_task, Due_date, Class_ID } = req.body;
  if (!Homework_task || !Due_date || !Class_ID) {
    return res.status(400).json({ error: "Homework_task, Due_date, and Class_ID are required" });
  }

  HomeworkModel.addHomework({ Homework_task, Due_date, Class_ID }, (err, results) => {
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

  HomeworkModel.updateHomework(id, { Homework_task, Due_date, Class_ID }, (err, results) => {
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
  
  HomeworkModel.deleteHomework(id, (err, results) => {
    if (err) {
      console.error("Error deleting homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Homework deleted successfully" });
  });
};

// Get upcoming homework
exports.getUpcomingHomework = (req, res) => {
  HomeworkModel.getUpcomingHomework((err, results) => {
    if (err) {
      console.error("Error fetching upcoming homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get recent homework
exports.getRecentHomework = (req, res) => {
  HomeworkModel.getRecentHomework((err, results) => {
    if (err) {
      console.error("Error fetching recent homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};