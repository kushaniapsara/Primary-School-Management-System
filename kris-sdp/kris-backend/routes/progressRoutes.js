const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const verifyToken = require('../middleware/auth'); // Ensure token validation


//router.post('/add', progressController.addProgress);

//router.put('/update', progressController.updateProgress);

// New route for fetching all subjects
router.get('/subjects', progressController.getAllSubjects);


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
