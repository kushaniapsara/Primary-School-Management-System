const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');

// GET students
router.get('/students', AttendanceController.getStudents);

// GET attendance records for last 5 days
router.get('/attendance', AttendanceController.getAttendance);

// POST save attendance
router.post('/attendance', AttendanceController.saveAttendance);

module.exports = router;
