const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const verifyToken = require("../middleware/auth");


// GET students
//router.get('/students', AttendanceController.getStudentsByClass);

// GET attendance records for last 5 days
router.get('/attendance', AttendanceController.getAttendance);

// POST save attendance
router.post('/attendance', AttendanceController.saveAttendance);

// For attendance chart on admin dashboard
router.get('/attendance-chart', AttendanceController.getAttendanceChartData);

// For teacher-specific class students
router.get("/by-class", verifyToken, AttendanceController.getStudentsByClass);



module.exports = router;
