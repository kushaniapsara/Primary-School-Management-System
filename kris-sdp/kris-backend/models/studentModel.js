const db = require('../config/db');

const Student = {
  findByUsername: async (username) => {
    const query = 'SELECT * FROM student WHERE username = ?';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
  },
};

module.exports = Student;
