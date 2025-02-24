const db = require('../config/db');

const getAdminByUsername = (username, callback) => {
  if (!username) {
    console.error('Username is undefined');
    return callback(new Error('Username is required'), null);
  }

  const sql = 'SELECT * FROM Admin WHERE username = ?';
  console.log('Executing query:', sql, 'with username:', username);

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return callback(err, null);
    }
    console.log('Query results:', results);
    return callback(null, results[0]); // Return only the first admin found
  });
};

module.exports = { getAdminByUsername };
