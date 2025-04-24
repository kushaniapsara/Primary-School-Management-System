const express = require('express');
const router = express.Router();
const TeacherProgressController = require('../controllers/TeacherProgressController');
const verifyToken = require("../middleware/auth");

// For teacher-specific class students
router.get("/by-class", verifyToken, TeacherProgressController.getStudentsByClass);

// New route for fetching all subjects
router.get('/subjects', TeacherProgressController.getAllSubjects);

router.get('/:studentId', TeacherProgressController.getProgressByStudent);

module.exports = router;
