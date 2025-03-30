const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/add', progressController.addProgress);
router.get('/:studentId', progressController.getProgressByStudent);
router.put('/update', progressController.updateProgress);


router.get('/subjects', progressController.getAllSubjects);


module.exports = router;


