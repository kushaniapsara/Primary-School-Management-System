// backend/routes/studyMaterials.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const studyMaterialController = require('../controllers/studyMaterialController');

router.get('/:category', studyMaterialController.getStudyMaterials);

router.post('/upload/:category', studyMaterialController.uploadStudyMaterial);

//router.get("/study-materials/:category", getMaterialsByCategory); //new



// Helper function to get file names from a folder
const getFilesFromFolder = (folderName) => {
  const directoryPath = path.join(__dirname, '../uploads/study_materials', folderName);
  return fs.readdirSync(directoryPath).map((file) => ({
    name: file,
    path: `/uploads/study_materials/${folderName}/${file}`, // Serve the file path
  }));
};

/*  // API to get all files in the 'music' folder
router.get('/music', (req, res) => {
  const files = getFilesFromFolder('music');
  res.json(files); // Send file paths and names
});

// API to get all files in the 'reading' folder
router.get('/reading', (req, res) => {
  const files = getFilesFromFolder('reading');
  res.json(files);
});

// API to get all files in the 'videos' folder
router.get('/videos', (req, res) => {
  const files = getFilesFromFolder('videos');
  res.json(files);
});

// API to get all files in the 'general_knowledge' folder
router.get('/general-knowledge', (req, res) => {
  const files = getFilesFromFolder('general_knowledge');
  res.json(files);
}); */

router.get("/api/study-materials/:category", async (req, res) => {
  const category = req.params.category;
  const sql = "SELECT * FROM StudyMaterial WHERE File_Type = ?";
  
  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error("Error fetching study materials:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});




module.exports = router;
