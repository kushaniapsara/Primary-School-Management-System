const express = require("express");
const { getStudents, addStudent, getStudentsByClass, promoteStudents, updateStudentStatus } = require("../controllers/studentController");
const verifyToken = require("../middleware/auth");
const { getStudentByID,getStudentAmount,addStudentPayment,getStudentPaymentHistory} = require('../controllers/studentControllerPayment');


const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);

//router.post('/addStudent', studentController.addStudent);


// For teacher-specific class students
router.get("/by-class", verifyToken, getStudentsByClass);

// routes/studentRoutes.js
router.post('/promote', promoteStudents);

router.put('/:id/status', updateStudentStatus);


//for payment
router.get('/payment/:id', getStudentByID);
router.get('/payment/amount/:studentId', getStudentAmount);
router.post('/payment/add', addStudentPayment);
router.get('/payment/history/:id', getStudentPaymentHistory);

 
module.exports = router; 
