const express = require("express");
const router = express.Router();
const extraCurricularController = require("../controllers/extraCurricularController");

// Define the GET route to fetch activities
router.get("/activities", extraCurricularController.getAllActivities);

router.post("/activities", extraCurricularController.addActivity);

router.get("/activities/:id", extraCurricularController.getActivityById);




module.exports = router;
