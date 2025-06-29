const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const studyMaterialController = require('../controllers/studyMaterialController');

router.get('/:category', studyMaterialController.getStudyMaterials);

router.post('/upload/:category', studyMaterialController.uploadStudyMaterial);




// Helper function to get file names from a folder
const getFilesFromFolder = (folderName) => {
  const directoryPath = path.join(__dirname, '../uploads/study_materials', folderName);
  return fs.readdirSync(directoryPath).map((file) => ({
    name: file,
    path: `/uploads/study_materials/${folderName}/${file}`, // Serve the file path
  }));
};



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
