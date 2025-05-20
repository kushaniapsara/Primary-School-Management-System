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



      let classQuery;
      if (role === 'Student') {
        classQuery = 'SELECT Class_ID FROM StudentClass WHERE Student_ID = ?';
      } else if (role === 'Teacher') {
        classQuery = 'SELECT Class_ID FROM TeacherClass WHERE Teacher_ID = ?';
      }
      
      let classId = null;
      
      if (classQuery) {
        const classResult = await queryAsync(classQuery, [user[idField]]);
        if (classResult.length > 0) {
          classId = classResult[0].Class_ID;
          className = classResult[0].Class_name;

        }
      }
      




      // Generate a JWT token
      const token = jwt.sign(
        { userID: user[idField], role: role, class_id: classId}, // Assign correct user ID field
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
    const { userID, role } = decoded;

    let userQuery, userDetails, classJoinQuery, classDetails;

    if (role === 'Teacher') {
      // Fetch teacher details
      userQuery = 'SELECT * FROM Teacher WHERE Teacher_ID = ?';
      userDetails = await queryAsync(userQuery, [userID]);

      // Join with TeacherClass and Class to get class name
      classJoinQuery = `
  SELECT c.Class_ID, c.Class_name
FROM TeacherClass tc
INNER JOIN (
  SELECT Teacher_ID, MAX(Academic_year) AS LatestYear
  FROM TeacherClass
  GROUP BY Teacher_ID
) latest ON tc.Teacher_ID = latest.Teacher_ID AND tc.Academic_year = latest.LatestYear
JOIN Class c ON tc.Class_ID = c.Class_ID
WHERE tc.Teacher_ID = ?

      `;
      classDetails = await queryAsync(classJoinQuery, [userID]);
    } 
    else if (role === 'Student') {
      // Fetch student details
      userQuery = 'SELECT * FROM Student WHERE Student_ID = ?';
      userDetails = await queryAsync(userQuery, [userID]);

      // Join with StudentClass and Class to get class name
      classJoinQuery = `
  SELECT c.Class_ID, c.Class_name
FROM StudentClass sc
INNER JOIN (
  SELECT Student_ID, MAX(Academic_year) AS LatestYear
  FROM StudentClass
  GROUP BY Student_ID
) latest ON sc.Student_ID = latest.Student_ID AND sc.Academic_year = latest.LatestYear
JOIN Class c ON sc.Class_ID = c.Class_ID
WHERE sc.Student_ID = ?

      `;
      classDetails = await queryAsync(classJoinQuery, [userID]);
    } 
    else if (role === 'Admin') {
      // Admin doesn't have a class
      userQuery = 'SELECT * FROM Admin WHERE Admin_ID = ?';
      userDetails = await queryAsync(userQuery, [userID]);
      classDetails = [];
    } 
    else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (userDetails.length > 0) {
      const userProfile = userDetails[0];
      userProfile.class = classDetails.length > 0 ? classDetails[0].Class_name : null;
      userProfile.role = role; 

      return res.status(200).json(userProfile);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


//for the profile

exports.resetPassword = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET_KEY);
    const { userID, role } = decoded;

    const { currentPassword, newPassword } = req.body;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }

    // Determine table and ID field based on role
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
      return res.status(400).json({ message: "Invalid role" });
    }

    // Fetch current user
    const userQuery = `SELECT * FROM ?? WHERE ${idField} = ?`;
    const results = await queryAsync(userQuery, [table, userID]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const user = results[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    const updateQuery = `UPDATE ?? SET password = ? WHERE ${idField} = ?`;
    await queryAsync(updateQuery, [table, hashedNewPassword, userID]);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error('Password Reset Error:', error);
    return res.status(500).json({ message: "Server error", error });
  }
};