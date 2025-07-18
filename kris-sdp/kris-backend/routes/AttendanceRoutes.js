const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/AttendanceController");
const verifyToken = require("../middleware/auth");


// GET attendance records for last 5 days
router.get("/attendance", AttendanceController.getAttendance);

// POST save attendance
router.post("/attendance", verifyToken, AttendanceController.saveAttendance);

// For attendance chart on admin dashboard
router.get("/attendance-chart", AttendanceController.getAttendanceChartData);

// For teacher-specific class students
router.get("/by-class", verifyToken, AttendanceController.getStudentsByClass);

// New route to get student attendance percentage (parent dashboard)
router.get(
  "/attendance/student/:studentId/percentage",
  AttendanceController.getStudentAttendancePercentage
);

module.exports = router;