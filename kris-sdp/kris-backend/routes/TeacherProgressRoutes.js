const express = require('express');
const router = express.Router();
const TeacherProgressController = require('../controllers/TeacherProgressController');
const verifyToken = require("../middleware/auth");

// For teacher-specific class students
router.get("/by-class", verifyToken, TeacherProgressController.getStudentsByClass);

//for studentwise avg
router.get('/subject-averages', TeacherProgressController.getSubjectWiseAverage);


// Add Subject Route
router.post('/add-subject', TeacherProgressController.addSubject);

// New route for fetching all subjects
router.get('/subjects', TeacherProgressController.getAllSubjects);

router.get('/:studentId', TeacherProgressController.getProgressByStudent);

router.post('/save-mark', TeacherProgressController.saveMark);


module.exports = router;
