const db = require("../config/db"); 
const extraCurricularModel = require("../models/extraCurricularModel");

exports.getAllActivities = (req, res) => {
  const sql = "SELECT Activity_ID AS id, Activity_name AS name, Activity_emoji AS img FROM ExtraCurricularActivity";
  
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


// Add a new activity
exports.addActivity = (req, res) => {
  const { name, img, description, teacher_incharge, location } = req.body;

  if (!name || !img || !description || !teacher_incharge || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newActivity = { name, img, description, teacher_incharge, location };

  extraCurricularModel.addActivity(newActivity, (err, result) => {
    if (err) {
      console.error("Error adding activity:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({ message: "Activity added successfully", id: result.id });
  });
};


exports.getActivityById = (req, res) => {
  const activityId = req.params.id;
  db.query("SELECT Activity_name AS name, Activity_emoji AS img , Teacher_incharge, Location, Description FROM ExtraCurricularActivity WHERE Activity_ID = ?", [activityId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(result[0]); // Return the first match
  });
};


//enrolled students
exports.getEnrolledStudents = (req, res) => {
  const activityId = req.params.id;

  const query = `
    SELECT s.Student_ID, s.Full_Name, s.Contact_number
    FROM Student s
    JOIN StudentExtraCurricularActivity sea ON s.Student_ID = sea.Student_ID
    WHERE sea.Activity_ID = ? AND sea.Status = 'active'
  `;

  db.query(query, [activityId], (err, results) => {
    if (err) {
      console.error("Error fetching enrolled students:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(results);
  });
};