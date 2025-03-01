const express = require("express");
const { getTeachers, addTeacher } = require("../controllers/teacherController");

const router = express.Router();

router.get("/", getTeachers);
router.post("/", addTeacher);

//router.post('/addStudent', studentController.addStudent);

 
module.exports = router; 
