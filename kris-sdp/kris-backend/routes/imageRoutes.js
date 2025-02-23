const express = require('express');
const router = express.Router();
const { getImagesForActivity } = require('../controllers/imageController');

// Route to get images for a specific activity
router.get('/activities/:activityId/images', getImagesForActivity);

module.exports = router;
