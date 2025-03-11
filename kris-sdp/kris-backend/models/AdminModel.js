const db = require('../config/db');

const getAdminByUsername = (username, callback) => {
  const sql = 'SELECT * FROM Admin WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]); // Return only the first admin found
  });
};

// Fetch admin by ID (for profile retrieval)
const getAdminByID = (adminID, callback) => {
  const sql = 'SELECT * FROM Admin WHERE Admin_ID = ?';
  db.query(sql, [adminID], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]);
  });
};

module.exports = { getAdminByUsername, getAdminByID };
