const express = require('express');
const router = express.Router();
const extraCurricularPageController = require('../controllers/extraCurricularPageController');
const verifyToken = require('../middleware/auth'); // Ensure token validation


// Route to get enrolled activities for a student
router.get('/extra-curricular/:studentId', extraCurricularPageController.getStudentEnrolledActivities);

// Update award
router.put('/extra-curricular/:studentId/:activityId/award', extraCurricularPageController.updateAward);

// //for own progress of student
// router.get("/extra-curricular/me", verifyToken, (req, res) => {
//   console.log(" /me hit", req.userID); // <--- Add this

//   if (req.userRole !== "Student") {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   res.json({ studentId: req.userID });
// });

module.exports = router;
