const db = require("../config/db"); // Ensure correct database connection


const getTeacherClasses = (req, res, next) => {
  const teacherID = req.userID; // Extracted from token in auth.js

  if (!teacherID) {
    return res.status(400).json({ message: "Teacher ID is missing" });
  }

  const query = "SELECT Class_ID FROM TeacherClass WHERE Teacher_ID = ?";
  db.query(query, [teacherID], (error, results) => {
    if (error) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      req.classID = results[0].Class_ID; // Correctly storing the single Class_ID
      next();
    } else {
      return res.status(404).json({ message: "Class not found for teacher" });
    }
  });
};

module.exports = getTeacherClasses;
