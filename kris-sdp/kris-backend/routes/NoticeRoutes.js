const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");

// Routes for homework
router.get("/", noticeController.getAllNotice);
router.post("/", noticeController.addNotice);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);
//router.get("/upcoming", noticeController.getUpcomingHomework);
//router.get("/recent", noticeController.getRecentHomework);

module.exports = router;