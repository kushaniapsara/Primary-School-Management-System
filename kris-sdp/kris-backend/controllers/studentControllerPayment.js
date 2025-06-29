// controllers/studentControllerPayment.js
const pool = require('../config/db');  // ✅ path to db
const generatePdf = require('../utils/pdfSlipGenerator'); // ⬅️ This is the new utility for generating payment slip PDF


// Handler to get student payment info by ID
const getStudentByID = (req, res) => {
  const studentID = req.params.id;
  console.log('Student ID:', studentID);  // Check the student ID in the console

  const query = 'SELECT Student_ID, Name_with_initials, monthly_amount FROM student WHERE Student_ID = ?';

  pool.query(query, [studentID], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student Data:', results[0]); // Log the data fetched
    res.json(results[0]);
  });
};




// Route to get total payable amount for a student
const getStudentAmount = (req, res) => {
  const studentId = req.params.studentId;  // Get student ID from request parameters

  const query = `SELECT SUM(amount) AS totalAmount FROM student_payable WHERE student_id = ?`;

  pool.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }

    if (results.length > 0) {
      // Send the sum of the amounts as a response
      res.status(200).json({ totalAmount: results[0].totalAmount || 0 }); // Default to 0 if no amount found
    } else {
      res.status(404).json({ message: 'No payment records found for this student.' });
    }
  });
};


// POST route to record a student payment
const addStudentPayment = (req, res) => {
    const { student_id, amount, description } = req.body;
  
    // Convert amount to negative value
    const negativeAmount = -Math.abs(parseFloat(amount));
    const monthYear = 'Payment'; // As per your requirement
    const currentDate = new Date();
  
    const query = `
      INSERT INTO student_payable (student_id, date, amount, description, month_year)
      VALUES (?, ?, ?, ?, ?)`;
  
    pool.query(query, [student_id, currentDate, negativeAmount, description, monthYear], (err, result) => {
      if (err) {
        console.error('Error adding payment:', err);
        return res.status(500).json({ error: 'Failed to record payment' });
      }
  
      res.status(201).json({ message: 'Payment recorded successfully' });
    });
  };
  

// GET /api/students/payment/history/:id
const getStudentPaymentHistory = (req, res) => {
    const studentID = req.params.id;
  
    const query = `
      SELECT id, date, amount, description, month_year, student_id
      FROM student_payable
      WHERE student_id = ?
      ORDER BY date DESC`;
  
    pool.query(query, [studentID], (err, results) => {
      if (err) {
        console.error('Error fetching payment history:', err);
        return res.status(500).json({ error: 'Failed to retrieve payment history' });
      }
  
      res.json(results);
    });
  };
  
  // New: Generate and send payment slip as PDF
const downloadPaymentSlip = (req, res) => {
      console.log("Received for PDF:", req.body); // ✅ log raw data

  
  const { student_id, amount, description } = req.body;



  const query = 'SELECT Name_with_initials FROM Student WHERE Student_ID = ?';

  pool.query(query, [student_id], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve student info' });
    }

    const studentName = result[0].Name_with_initials;
    const currentDate = new Date().toLocaleDateString();
    const formattedAmount = `Rs. ${parseFloat(amount).toFixed(2)}`;

    const data = [
      { label: 'Student ID', value: student_id },
      { label: 'Student Name', value: studentName },
      { label: 'Amount Paid', value: formattedAmount },
      { label: 'Description', value: description },
      { label: 'Payment Date', value: currentDate }
    ];

    try {
      const pdfBuffer = await generatePdf(data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=payment_slip.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });
};

module.exports = { getStudentByID, getStudentAmount, addStudentPayment,getStudentPaymentHistory,   downloadPaymentSlip
 };