const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');

const SECRET_KEY = "your_secret_key"; // Store securely in environment variables

const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  AdminModel.getAdminByUsername(username, (err, admin) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (!admin || password !== admin.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userID: admin.Admin_ID, role: 'Admin' },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });
  });
};

// Get Admin Profile
const getAdminProfile = (req, res) => {
  const adminID = req.userID; // Extracted from JWT token

  AdminModel.getAdminByID(adminID, (err, admin) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  });
};

module.exports = { adminLogin, getAdminProfile };
