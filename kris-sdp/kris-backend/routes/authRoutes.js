const express = require('express');
const verifyToken = require('../middleware/auth');
const db = require('../config/db');  // Import the database connection
const router = express.Router();
const { login,resetPassword } = require('../controllers/authController');

router.post('/login', login);

router.post('/reset-password', resetPassword);

// Get profile details of logged-in user
router.get('/profile', verifyToken, (req, res) => {
  const { userID, userRole, classID } = req;

  let table, idField;
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

  // Query user details
  db.query(`SELECT * FROM ?? WHERE ?? = ?`, [table, idField, userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // If user has classID (not admin), fetch class info
    if (classID) {
      db.query('SELECT * FROM Class WHERE Class_ID = ?', [classID], (err2, classResults) => {
        if (err2) {
          return res.status(500).json({ message: 'Class DB error', error: err2 });
        }
        user.class_id = classID;
        user.class_name = classResults[0]?.Class_name || null;
        user.class_location = classResults[0]?.Location || null;
        res.json(user);
      });
    } else {
      res.json(user);
    }
  });
});


module.exports = router;


//for the profile