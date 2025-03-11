const db = require('../config/db'); // Import the database connection
const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; // Keep this secret and use env variables in production

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Determine the table and ID field based on the role
    let table, idField;
    if (role === 'Teacher') {
      table = 'Teacher';
      idField = 'Teacher_ID';
    } else if (role === 'Student') {
      table = 'Student';
      idField = 'Student_ID';
    } else if (role === 'Admin') {
      table = 'Admin';
      idField = 'Admin_ID';
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Use a secure query to fetch the user
    const query = `SELECT * FROM ?? WHERE username = ? AND password = ?`;
    db.query(query, [table, username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log database error for debugging
        return res.status(500).json({ message: 'Database error', error: err });
      }

      console.log('Query results:', results); // Log query results for debugging

      if (results.length > 0) {
        const user = results[0];

        // Generate a JWT token
        const token = jwt.sign(
          { userID: user[idField], role: role }, // Assign correct user ID field
          SECRET_KEY,
          { expiresIn: "1h" } // Token expires in 1 hour
        );

        return res.status(200).json({
          message: `Welcome, ${user.username}!`,
          token
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });

  } catch (error) {
    console.error('Server error:', error); // Log server error for debugging
    res.status(500).json({ message: 'Server error', error });
  }
};
