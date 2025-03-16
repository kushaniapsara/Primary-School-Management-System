const db = require('../config/db'); // Import the database connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

const SECRET_KEY = "your_secret_key"; // Keep this secret and use env variables in production

// Convert the query to return a promise
const queryAsync = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.login = async (req, res) => { // Make sure the login function is async
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

    // Use the queryAsync function to fetch the user
    const query = `SELECT * FROM ?? WHERE username = ?`;
    const results = await queryAsync(query, [table, username]);

    if (results.length > 0) {
      const user = results[0];

      // Compare the entered password with the stored hashed password 
      const isMatch = await bcrypt.compare(password, user.password); // This needs to be in an async function
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

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
  } catch (error) {
    console.error('Server error:', error); // Log server error for debugging
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET_KEY);
    const { userID, role } = decoded; // Get userID and role from token

    console.log(decoded);

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

    // Fetch user details from the correct table
    const query = `SELECT * FROM ?? WHERE ?? = ?`;
    const results = await queryAsync(query, [table, idField, userID]);

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
