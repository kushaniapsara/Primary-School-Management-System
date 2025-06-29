const express = require('express');
const router = express.Router();
const extraCurricularPageController = require('../controllers/extraCurricularPageController');
const verifyToken = require('../middleware/auth'); // Ensure token validation


// Route to get enrolled activities for a student
router.get('/extra-curricular/:studentId', extraCurricularPageController.getStudentEnrolledActivities);

// Update award
router.put('/extra-curricular/:studentId/:activityId/award', extraCurricularPageController.updateAward);


module.exports = router;
