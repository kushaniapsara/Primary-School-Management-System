const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const verifyToken = require('../middleware/auth'); // Ensure token validation

// New route: Get all students in teacher's class for selected academic year
// New extended progress for all students in class/year with subject details
router.get(
  "/students/details",
  verifyToken,
  progressController.getStudentSubjectsByClassAndYear
);

router.post("/addsubmarks", verifyToken, progressController.addSubjectMarks);

// In routes/progress.js:
router.get("/subjects", verifyToken, progressController.getSubjectsForClass);
router.get('/students', verifyToken, progressController.getStudentsByClassAndYear)
//router.post('/add', progressController.addProgress);

//router.put('/update', progressController.updateProgress);

// // New route for fetching all subjects
// router.get('/subjects', progressController.getAllSubjects);


// Comment-related routes
router.post('/comment/add', progressController.addComment);
router.get('/comment/:studentId', progressController.getCommentsByStudent);


// New route: get progress for logged-in student

//for own progress of student
router.get("/me", verifyToken, (req, res) => {
  console.log("ProgressRoute /me hit", req.userID); // <--- Add this

  if (req.userRole !== "Student") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ studentId: req.userID });
});

router.get('/:studentId', progressController.getProgressByStudent);


module.exports = router;