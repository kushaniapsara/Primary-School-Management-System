const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");

// Routes for homework
router.get("/", noticeController.getAllNotice);
router.post("/", noticeController.addNotice);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);


module.exports = router;