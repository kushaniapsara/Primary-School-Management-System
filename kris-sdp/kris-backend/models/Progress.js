const db = require('../config/db');

const Progress = {

   // Get progress by student, joining with Subject table to fetch Subject_name
   getProgressByStudent: (studentId, callback) => {
    const sql = `
      SELECT ss.Student_ID, ss.Subject_ID, ss.Marks, ss.Average, ss.Date, s.Subject_name
      FROM StudentSubject ss
      JOIN Subject s ON ss.Subject_ID = s.Subject_ID
      WHERE ss.Student_ID = ?
    `;
    db.query(sql, [studentId], callback);
  },
  

// Add a general progress comment for a student
addComment: (studentId, comment, callback) => {
  const sql = `INSERT INTO ProgressComment (Student_ID, Comment) VALUES (?, ?)`;
  db.query(sql, [studentId, comment], callback);
},

// Get all general progress comments for a student
getCommentsByStudent: (studentId, callback) => {
  const sql = `
    SELECT Comment_ID, Comment, Created_At
    FROM ProgressComment
    WHERE Student_ID = ?
    ORDER BY Created_At DESC
  `;
  db.query(sql, [studentId], callback);
},



};

module.exports = Progress;
