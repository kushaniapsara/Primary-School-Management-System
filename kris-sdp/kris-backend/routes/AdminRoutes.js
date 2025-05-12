const express = require("express");
const { getAdmins, addAdmin, updateAdminStatus } = require("../controllers/adminController");

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);

//router.post('/addStudent', studentController.addStudent);

router.put('/:id/status', updateAdminStatus);

 
module.exports = router; 
