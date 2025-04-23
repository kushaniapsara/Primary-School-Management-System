const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/generate', reportController.createReport);
router.get('/download/:filename', reportController.downloadReport);

module.exports = router;
