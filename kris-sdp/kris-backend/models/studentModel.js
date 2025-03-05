const db = require('../config/db');

const Student = {
  findByUsername: async (username) => {
    const query = 'SELECT * FROM Student WHERE username = ?';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
  },



  getAll: (callback) => {
    const query = "SELECT * FROM Student"; // Fetch all students
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },


};



module.exports = Student;
//for login