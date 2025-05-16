const AttendanceModel = require('../models/AttendanceModel');

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
      console.log("Students fetched:", results); // Add this log to verify

      res.json(results);
    });
  };

// Fetch attendance records for the last 5 days
const getAttendance = (req, res) => {
    AttendanceModel.getAttendance((error, attendance) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch attendance' });
            return;
        }
        res.json(attendance);
    });
};

// Save attendance records
const saveAttendance = (req, res) => {
    const { date, attendance } = req.body;

    AttendanceModel.saveAttendance(date, attendance, (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Error saving attendance' });
            return;
        }

        res.status(200).json({ message: 'Attendance saved successfully' });
    });
};

//for dashboard
const getAttendanceChartData = (req, res) => {
    AttendanceModel.getAttendanceChartData((error, data) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch chart data' });
            return;
        }
        res.json(data);
    });
};


// Get attendance percentage for a student (for Parent Dashboard)
const getStudentAttendancePercentage = (req, res) => {
  const studentId = req.params.studentId;
  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN Status = 1 THEN 1 ELSE 0 END) AS present
    FROM Attendance
    WHERE Student_ID = ?
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const { total, present } = results[0];
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    res.json({ percentage });
  });
};

module.exports = { getStudentsByClass, getAttendance, saveAttendance, getAttendanceChartData, getStudentAttendancePercentage };
