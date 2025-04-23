const HomeworkModel = require("../models/HomeworkModel");

// Get all homework
exports.getAllHomeworkByClass = (req, res) => {
  const classId = req.classID; // Access class_id from the token

  HomeworkModel.getAllHomeworkByClass(classId,(err, results) => {
    if (err) {
      console.error("Error fetching all homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add new homework
exports.addHomework = (req, res) => {
  const { Homework_task, Due_date } = req.body;
  const Class_ID = req.classID; // ✅ Use classID from req

  console.log("🔧 Controller - Class ID from token (req.classID):", req.classID);
  console.log("📦 Controller - Request Body:", req.body);

  if (!Homework_task || !Due_date || !Class_ID) {
    return res.status(400).json({ error: "Homework_task, Due_date, and Class_ID are required" });
  }

  HomeworkModel.addHomework({ Homework_task, Due_date, Class_ID }, (err, results) => {
    if (err) {
      console.error("❌ Error adding homework:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("✅ Homework added:", results);
    res.status(201).json({ Homework_ID: results.insertId, Homework_task, Due_date, Class_ID });
  });
};

// Update existing homework
exports.updateHomework = (req, res) => {
  const { id } = req.params;
  const { Homework_task, Due_date } = req.body;
  const Class_ID = req.classID; // ✅ Use classID from token

  console.log("🔧 Controller - Class ID from token (req.classID):", req.classID);
  console.log("📦 Controller - Request Body:", req.body);
  console.log("🆔 Homework ID (param):", id);

  if (!Homework_task || !Due_date || !Class_ID) {
    return res.status(400).json({ error: "Homework_task, Due_date, and Class_ID are required" });
  }

  HomeworkModel.updateHomework(id, { Homework_task, Due_date, Class_ID }, (err, results) => {
    if (err) {
      console.error("❌ Error updating homework:", err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("✅ Homework updated:", results);
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
  const classId = req.classID;

  HomeworkModel.getUpcomingHomeworkByClass(classId, (err, results) => {
    if (err) {
      console.error("Error fetching upcoming homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get recent homework
exports.getRecentHomework = (req, res) => {
  const classId = req.classID;

  HomeworkModel.getRecentHomework(classId, (err, results) => {
    if (err) {
      console.error("Error fetching recent homework:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};