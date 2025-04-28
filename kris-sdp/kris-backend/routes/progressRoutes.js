const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

//router.post('/add', progressController.addProgress);
router.get('/:studentId', progressController.getProgressByStudent);
//router.put('/update', progressController.updateProgress);

// New route for fetching all subjects
router.get('/subjects', progressController.getAllSubjects);

// Comment-related routes
router.post('/comment/add', progressController.addComment);
router.get('/comment/:studentId', progressController.getCommentsByStudent);


module.exports = router;
