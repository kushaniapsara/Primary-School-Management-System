const db = require('../config/db');

const Progress = {
  addProgress: (studentId, subjectId, date, marks, average, callback) => {
    const sql = `INSERT INTO StudentSubject (Student_ID, Subject_ID, Date, Marks, Average) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [studentId, subjectId, date, marks, average], callback);
  },

   // Get progress by student, joining with Subject table to fetch Subject_Name
   getProgressByStudent: (studentId, callback) => {
    const sql = `
      SELECT ss.Student_ID, ss.Subject_ID, ss.Marks, ss.Average, ss.Date, s.Subject_Name
      FROM StudentSubject ss
      JOIN Subject s ON ss.Subject_ID = s.Subject_ID
      WHERE ss.Student_ID = ?
    `;
    db.query(sql, [studentId], callback);
  },

  // Fetch all subjects for dropdown
  getAllSubjects: (callback) => {
    const sql = 'SELECT Subject_ID, Subject_Name FROM Subject'; // Query to fetch all subjects
    db.query(sql, callback);
  },

  updateProgress: (studentId, subjectId, marks, average, callback) => {
    const sql = `UPDATE StudentSubject SET Marks = ?, Average = ? WHERE Student_ID = ? AND Subject_ID = ?`;
    db.query(sql, [marks, average, studentId, subjectId], callback);
  }
};

module.exports = Progress;
