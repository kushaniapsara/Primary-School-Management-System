const db = require('../config/db');

const Teacher = {
  findByUsername: async (username) => {
    const query = 'SELECT * FROM teacher WHERE username = ?';
    const [rows] = await db.execute(query, [username]);
    return rows[0];
  },
};

module.exports = Teacher;
//these files for login