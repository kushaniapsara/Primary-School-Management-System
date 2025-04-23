const db = require("../config/db");

// Fetch students from the database
// Get students by class ID
const getStudentsByClass = (classID, callback) => {
  const sql = `
    SELECT s.*
    FROM Student s
    INNER JOIN StudentClass sc ON s.Student_ID = sc.Student_ID
    WHERE sc.Class_ID = ?
  `;
  pool.query(sql, [classID], callback);
}