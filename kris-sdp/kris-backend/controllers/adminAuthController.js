const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // Number of salt rounds for hashing

const SECRET_KEY = "your_secret_key"; // Store securely in environment variables

const adminLogin = async (req, res) => { // Make function async
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    AdminModel.getAdminByUsername(username, async (err, admin) => { // Callback remains but inner function needs async
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Compare the entered password with the stored hashed password 
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token

    const user = await db.User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "full_name", "email", "Role", "address", "contact_number", "class"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send all user details to the frontend
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { adminLogin, getAdminProfile };
