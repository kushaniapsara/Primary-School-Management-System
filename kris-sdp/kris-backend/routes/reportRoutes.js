const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { generateReport, generateLeavingCertificate} = require('../controllers/reportController');

router.post('/generate', generateReport);

// 🆕 Route to generate leaving certificate
router.post('/generate-leaving-certificate', generateLeavingCertificate);

// Download route
router.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '..', 'downloads', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath); // Automatically sets content headers
    } else {
        res.status(404).send({ error: 'File not found' });
    }
});

module.exports = router;
