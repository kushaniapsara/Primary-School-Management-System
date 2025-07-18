const express = require("express");
const { getAdmins, addAdmin, updateAdminStatus } = require("../controllers/adminController");

const { getAllStudents, addCustomFee, updateMonthlyAmount, addMonthlyForAll, addMonthlyForOne, getAllStudentPayments } = require('../controllers/adminControllerPayment');

const router = express.Router();

const subjectController = require('../controllers/adminController');

// POST /api/subjects
router.post('/addSubject', subjectController.addSubject);

// GET /api/subjects
router.get('/getSubjects', subjectController.getSubjects);


router.get("/", getAdmins);
router.post("/", addAdmin);

router.post('/payable/addCustomFee', addCustomFee);

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