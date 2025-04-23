const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studyMaterialModel = require('../models/studyMaterialModel');

// Ensure upload directory exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.params.category;
    const uploadPath = `./uploads/study_materials/${category}/`;

    // Create directory if it does not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage }).single("file"); // ✅ Ensure "file" matches frontend key

const uploadStudyMaterial = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    // ✅ Move logs here, AFTER file is processed
    console.log("Received file:", req.file);
    console.log("Request body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, class_id } = req.body;
    const fileType = req.params.category;
    const filePath = `uploads/study_materials/${fileType}/${req.file.filename}`;
    const materialId = `MAT${Date.now()}`;

    studyMaterialModel.addStudyMaterial(
      materialId, title, description, class_id, fileType, filePath,
      (err, result) => {
        if (err) {
          console.error("Database error:", err); // ✅ Log database errors

          return res.status(500).json({ message: "Database insertion failed", error: err.message });
        }
        console.log("Database insertion success:", result);

        res.status(200).json({ message: "File uploaded and data saved", result });
      }
    );
  });
};



// Get study materials by category
const getStudyMaterials = (req, res) => {
  const { category } = req.params;
  studyMaterialModel.getStudyMaterialsByCategory(category, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database query failed', error: err.message });
    res.status(200).json({ materials: results });
  });
};



module.exports = {uploadStudyMaterial, getStudyMaterials};
