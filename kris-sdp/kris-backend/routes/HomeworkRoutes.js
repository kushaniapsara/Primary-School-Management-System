const express = require("express");
const router = express.Router();
const homeworkController = require("../controllers/HomeworkController");

// Routes for homework
router.get("/", homeworkController.getAllHomework);
router.post("/", homeworkController.addHomework);
router.put("/:id", homeworkController.updateHomework);
router.delete("/:id", homeworkController.deleteHomework);
router.get("/upcoming", homeworkController.getUpcomingHomework);
router.get("/recent", homeworkController.getRecentHomework);

module.exports = router;