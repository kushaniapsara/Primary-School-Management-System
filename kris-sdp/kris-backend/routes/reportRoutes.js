const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Ensure token validation

const { generateReport, generateLeavingCertificate, getStudents, getStudentDetails, generateProgressReport} = require('../controllers/reportController');

router.post('/generate', generateReport);

// 🆕 Route to generate leaving certificate
router.post('/generate-leaving-certificate', generateLeavingCertificate);

router.get('/students', getStudents);
router.get('/student/:studentId', getStudentDetails);

//for progress reports
router.post('/progress-report', verifyToken, generateProgressReport);


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
