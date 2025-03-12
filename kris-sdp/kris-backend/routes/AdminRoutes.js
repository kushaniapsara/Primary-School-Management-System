const express = require("express");
const { getAdmins, addAdmin } = require("../controllers/adminController");

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);

//router.post('/addStudent', studentController.addStudent);

 
module.exports = router; 
