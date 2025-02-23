const express = require('express');
const router = express.Router();
const { uploadImage, saveImage } = require('../controllers/uploadController');

// Route to handle the image upload
router.post('/upload', uploadImage, saveImage);

module.exports = router;
