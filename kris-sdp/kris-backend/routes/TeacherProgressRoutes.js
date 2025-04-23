const express = require('express');
const router = express.Router();
const TeacherProgressController = require('../controllers/AttendanceController');
const verifyToken = require("../middleware/auth");

// For teacher-specific class students
router.get("/by-class", verifyToken, TeacherProgressController.getStudentsByClass);