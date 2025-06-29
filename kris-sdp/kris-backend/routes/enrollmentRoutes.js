const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const verifyToken = require('../middleware/auth'); // Import middleware

// Route for enrolling a student in an activity
router.post('/', verifyToken, enrollmentController.enrollInActivity);

module.exports = router;
//extra curricular enrollment