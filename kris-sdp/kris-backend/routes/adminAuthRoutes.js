const express = require('express');
const { adminLogin, getAdminProfile } = require('../controllers/adminAuthController');
const verifyToken = require('../middleware/auth'); // Ensure token validation

const router = express.Router();

router.post('/login', adminLogin);
router.get('/profile', verifyToken, getAdminProfile); // Fetch admin profile



module.exports = router;
