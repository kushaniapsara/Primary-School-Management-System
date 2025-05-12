const db = require("../config/db");

// Get students by class ID
const getStudentsByClass = (classID, callback) => {
  const sql = `
    SELECT s.*
    FROM Student s
    INNER JOIN StudentClass sc ON s.Student_ID = sc.Student_ID
    WHERE sc.Class_ID = ?
  `;
  db.query(sql, [classID], callback);
};

// Get progress of a student with subject names
const getProgressByStudent = (studentId, callback) => {
  const sql = `
    SELECT ss.Student_ID, ss.Subject_ID, ss.Marks, ss.Average, ss.Date, s.Subject_name
    FROM StudentSubject ss
    JOIN Subject s ON ss.Subject_ID = s.Subject_ID
    WHERE ss.Student_ID = ?
  `;
  db.query(sql, [studentId], callback);
};

const getAllSubjects = (callback) => {
  const sql = `SELECT * FROM Subject`; // ←✅ This is where it fetches from the Subject table
  db.query(sql, callback);
};



// Insert or update marks for a student and subject
const saveMark = (studentId, subjectId, marks, callback) => {
  const sql = `
    INSERT INTO StudentSubject (Student_ID, Subject_ID, Marks)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE Marks = ?
  `;

  db.query(sql, [studentId, subjectId, marks, marks], callback);
};

//subjectwise avg
const getSubjectWiseAverage = (callback) => {
  const sql = `
    SELECT s.Subject_name, ROUND(AVG(ss.Marks), 2) AS AverageMarks
    FROM StudentSubject ss
    JOIN Subject s ON ss.Subject_ID = s.Subject_ID
    GROUP BY ss.Subject_ID
  `;
  db.query(sql, callback);
}

const addSubject = (subjectName, callback) => {
  const sql = `INSERT INTO Subject (Subject_name) VALUES (?)`;
  db.query(sql, [subjectName], callback);
};


module.exports = {
  getStudentsByClass,
  getProgressByStudent, getAllSubjects, saveMark, getSubjectWiseAverage, addSubject
};
