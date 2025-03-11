const express = require('express');
const verifyToken = require('../middleware/auth');
const db = require('../config/db');  // Import the database connection
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

// Get profile details of logged-in user
router.get('/profile', verifyToken, (req, res) => {
  const { userID, userRole } = req;

  // Determine the table based on the userRole
  let table;
  let idField;
  if (userRole === 'Teacher') {
    table = 'Teacher';
    idField = 'Teacher_ID';
  } else if (userRole === 'Student') {
    table = 'Student';
    idField = 'Student_ID';
  } else if (userRole === 'Admin') {
    table = 'Admin';
    idField = 'Admin_ID';
  }

  db.query(`SELECT * FROM ?? WHERE ?? = ?`, [table, idField, userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]); // Return user details
  });
});

module.exports = router;
