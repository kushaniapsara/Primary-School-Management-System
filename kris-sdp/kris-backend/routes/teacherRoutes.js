const express = require("express");
const {
  getTeachers,
  addTeacher,
  promoteTeachers,
  updateTeacherStatus,
  updateTeacherDetails,
  changeTeacherPassword,
} = require("../controllers/teacherController");

const router = express.Router();

router.get("/", getTeachers);
router.post("/", addTeacher);

//router.post('/addStudent', studentController.addStudent);

// routes/studentRoutes.js
router.post("/promote", promoteTeachers);

router.put("/:id/status", updateTeacherStatus);
router.put("/details/:id", updateTeacherDetails);
router.put("/changepw/:id", changeTeacherPassword);

module.exports = router;
