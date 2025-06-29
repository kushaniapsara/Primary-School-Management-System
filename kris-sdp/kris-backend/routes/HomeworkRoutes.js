const express = require("express");
const router = express.Router();
const homeworkController = require("../controllers/HomeworkController");

const verifyToken = require("../middleware/auth");
const getTeacherClasses = require("../middleware/getTeacherClasses");

// Routes for homework
router.get("/", verifyToken, homeworkController.getAllHomeworkByClass);
router.post("/", verifyToken, homeworkController.addHomework);
router.put("/:id", verifyToken, homeworkController.updateHomework);
router.delete("/:id", homeworkController.deleteHomework);
router.get("/upcoming", homeworkController.getUpcomingHomework);
router.get("/recent", homeworkController.getRecentHomework);




module.exports = router;