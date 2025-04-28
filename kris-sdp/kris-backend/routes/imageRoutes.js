const express = require('express');
const router = express.Router();
const { getImagesForActivity } = require('../controllers/imageController');
const { deleteImage } = require('../controllers/imageController');


// Route to get images for a specific activity
router.get('/activities/:activityId/images', getImagesForActivity);

// Route to delete an image
router.delete('/images/:imageId', deleteImage);

module.exports = router;
