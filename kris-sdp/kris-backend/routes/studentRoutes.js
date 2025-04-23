const express = require("express");
const { getStudents, addStudent, getStudentsByClass, promoteStudents } = require("../controllers/studentController");
const verifyToken = require("../middleware/auth");


const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);

//router.post('/addStudent', studentController.addStudent);


// For teacher-specific class students
router.get("/by-class", verifyToken, getStudentsByClass);

// routes/studentRoutes.js
router.post('/promote', promoteStudents);


 
module.exports = router; 
