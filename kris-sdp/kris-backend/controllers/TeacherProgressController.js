const TeacherProgressModel = require('../models/TeacherProgressModel');

// Fetch students
// New function for class-specific student list for teacher
const getStudentsByClass = (req, res) => {
    const classID = req.classID;
  
    if (!classID) {
      return res.status(403).json({ error: "Class ID missing in token" });
    }
  
    AttendanceModel.getStudentsByClass(classID, (err, results) => {
      if (err) {
        console.error("Error fetching students by class:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  };

  module.exports = { getStudentsByClass};
