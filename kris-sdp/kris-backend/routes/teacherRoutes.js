const express = require("express");
const { getTeachers, addTeacher, promoteTeachers, updateTeacherStatus  } = require("../controllers/teacherController");

const router = express.Router();

router.get("/", getTeachers);
router.post("/", addTeacher);

//router.post('/addStudent', studentController.addStudent);

 
// routes/studentRoutes.js
router.post('/promote', promoteTeachers);

router.put('/:id/status', updateTeacherStatus);


module.exports = router; 
