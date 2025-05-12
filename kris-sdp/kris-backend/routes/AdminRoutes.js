const express = require("express");
const { getAdmins, addAdmin, updateAdminStatus } = require("../controllers/adminController");

const { getAllStudents, updateMonthlyAmount, addMonthlyForAll, addMonthlyForOne, getAllStudentPayments } = require('../controllers/adminControllerPayment');

const router = express.Router();

router.get("/", getAdmins);
router.post("/", addAdmin);

//router.post('/addStudent', studentController.addStudent);

router.put('/:id/status', updateAdminStatus);

//for payment
router.post('/payable/addMonthlyAll', addMonthlyForAll);
router.post('/payable/addMonthlySingle', addMonthlyForOne);

router.get('/payments', getAllStudentPayments);

// Route to get all students
router.get('/students', getAllStudents);

// Route to update monthly_amount
router.post('/students/update', updateMonthlyAmount);

 
module.exports = router; 
