const db = require('../config/db'); // Import the database connection


const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
      const { activityId } = req.body; // Ensure the activityId is sent with the request
      if (!activityId) {
        return cb(new Error('Activity ID is missing'), false);
      }
      const ext = path.extname(file.originalname);
      cb(null, `activity_${activityId}_${Date.now()}${ext}`); // Unique name
    },
  });
  
  const upload = multer({ storage });
  

// Controller function to handle image upload
const uploadImage = upload.single('image'); // Single image field in form

// This route is to save the image to the server and store its path in the database
const saveImage = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const { activityId } = req.body; // Extract Activity_ID from form data
    const imagePath = `/uploads/${req.file.filename}`; // Relative path to save in DB
  
    try {
      // Save the image path to the database
      await db.execute(
        'INSERT INTO ActivityImages (Activity_ID, Image_Path) VALUES (?, ?)',
        [activityId, imagePath]
      );
      res.json({ message: 'Image uploaded successfully', imagePath });
    } catch (error) {
      console.error('Error saving image path to DB', error);
      res.status(500).json({ message: 'Database error' });
    }
  };
  

module.exports = { uploadImage, saveImage };
