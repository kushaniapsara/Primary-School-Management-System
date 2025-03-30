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

//Ensure only specific file types are allowed 
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      music: ["audio/mpeg", "audio/mp3"],
      reading: ["application/pdf"],
      videos: ["video/mp4"],
      general_knowledge: ["application/pdf", "image/jpeg"]
    };
    const category = req.params.category;
    if (allowedTypes[category] && allowedTypes[category].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");


// Handle file upload
const uploadStudyMaterial = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Please upload a valid file', error: err.message });

    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `uploads/study_materials/${req.params.category}/${req.file.filename}`;
    studyMaterialModel.addStudyMaterial(req.params.category, filePath, (dbErr, result) => {
      if (dbErr) {
        return res.status(500).json({ message: "Database error", error: dbErr.message });
      }
      res.status(200).json({ message: "Upload successful", result });
    });
  });
};


// Get study materials by category
const getStudyMaterials = (req, res) => {
  const category = req.params.category; // e.g., 'general-knowledge'
  const sql = "SELECT fileName FROM StudyMaterials WHERE category = ?";
  
  db.query(sql, [category], (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
  });
};




module.exports = {
  uploadStudyMaterial,
  getStudyMaterials,
};
