// controllers/studentControllerPayment.js
const pool = require('../config/db');  // ✅ correct path to db

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



// In your controller file (e.g., studentController.js)

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
      SELECT id, date, amount, description, month_year
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
  
  

module.exports = { getStudentByID, getStudentAmount, addStudentPayment,getStudentPaymentHistory };