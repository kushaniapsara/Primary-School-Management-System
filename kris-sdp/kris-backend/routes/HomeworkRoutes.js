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


/*// ✅ Correct Order: verifyToken → getTeacherClasses → Route Handler
router.get("/", verifyToken, getTeacherClasses, (req, res) => {
    const classID = req.classID;
  
    if (!classID) {
      return res.status(400).json({ message: "Class ID is missing" });
    }
  
    const query = "SELECT * FROM Homework WHERE Class_ID = ?";
    db.query(query, [classID], (error, results) => {
      if (error) return res.status(500).json({ message: "Database error" });
  
      res.json(results);
    });
  });*/


module.exports = router;