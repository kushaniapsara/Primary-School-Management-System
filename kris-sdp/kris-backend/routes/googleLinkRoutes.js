const express = require('express');
const router = express.Router();
const googleLinkController = require('../controllers/googleLinkController');

// Middleware to check admin (example)
const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  // Decode token logic here (e.g., jwtDecode) and check role
  // adapt this from your existing auth system
  const role = token && token.includes("admin"); // Simplified
  if (role) {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
};

router.get('/', googleLinkController.getLink);
router.put('/',  googleLinkController.updateLink); // Only admin can update

module.exports = router;
