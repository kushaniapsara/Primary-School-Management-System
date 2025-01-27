const db = require('../config/db'); // Import the database connection

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Determine the table based on the role
    const table = role === 'Teacher' ? 'Teacher' : 'Student';

    // Use a secure query to fetch the user
    const query = `SELECT * FROM ?? WHERE username = ? AND password = ?`;
    db.query(query, [table, username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log database error for debugging
        return res.status(500).json({ message: 'Database error', error: err });
      }

      console.log('Query results:', results); // Log query results for debugging

      if (results.length > 0) {
        // Login successful
        return res.status(200).json({ message: `Welcome, ${results[0].username}!` });
      } else {
        // Login failed
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  } catch (error) {
    console.error('Server error:', error); // Log server error for debugging
    res.status(500).json({ message: 'Server error', error });
  }
};
