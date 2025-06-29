const Progress = require('../models/Progress');
const db = require("../config/db"); //  MySQL connection


exports.getProgressByStudent = (req, res) => {
  const studentId = req.params.studentId;

  Progress.getProgressByStudent(studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

  // Add comment
exports.addComment = (req, res) => {
  const { studentId, comment } = req.body;

  if (!comment || !studentId) {
    return res.status(400).json({ message: 'Student ID and comment are required' });
  }

  Progress.addComment(studentId, comment, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Comment added successfully' });
  });
};

// Get comments by student
exports.getCommentsByStudent = (req, res) => {
  const studentId = req.params.studentId;

  Progress.getCommentsByStudent(studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

//for own progress of student
exports.getMyProgress = (req, res) => {
  const studentId = req.userID; // From verifyToken middleware

  const sql = 'SELECT * FROM StudentSubject WHERE Student_ID = ?'; 

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    return res.status(200).json(result);
  });
};


exports.getStudentSubjectsByClassAndYear = async (req, res) => {
  try {
    const classId = req.classID; // from middleware
    const year = req.query.year;

    if (!classId || !year) {
      return res.status(400).json({ message: "Class ID or Academic Year missing" });
    }

    // Get all students in class and year
    const studentsQuery = `
      SELECT s.Student_ID, s.Full_name
      FROM studentclass sc
      JOIN student s ON sc.Student_ID = s.Student_ID
      WHERE sc.Class_ID = ? AND sc.Academic_year = ?
    `;

    db.query(studentsQuery, [classId, year], (err, students) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });

      if (!students.length) return res.json([]);

      // Get all subject marks for these students
      const studentIds = students.map((stu) => stu.Student_ID);
      const placeholders = studentIds.map(() => '?').join(',');

      const subjectsQuery = `
        SELECT ss.Student_ID, sub.Subject_name, ss.Marks, ss.Term, ss.Date, ss.year
        FROM studentsubject ss
        JOIN subject sub ON ss.Subject_ID = sub.Subject_ID
        WHERE ss.Student_ID IN (${placeholders})
      `;

      db.query(subjectsQuery, studentIds, (err2, subjects) => {
        if (err2) return res.status(500).json({ message: "DB error", error: err2 });

        // Attach subject marks to each student
        const result = students.map((student) => ({
          Student_ID: student.Student_ID,
          Full_name: student.Full_name,
          subjects: subjects
            .filter((row) => row.Student_ID === student.Student_ID)
            .map(({ Subject_name, Marks, Term, Date, year }) => ({
              Subject_name,
              Marks,
              Term,
              Date,
              year
            })),
        }));

        res.json(result);
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.addSubjectMarks = (req, res) => {
  const { subject_id, term, year, entries } = req.body;
  const date = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  console.log("Received data:", req.body);

  if (!subject_id || !term || !year || !entries || !entries.length) {
    return res.status(400).json({ message: "Missing data" });
  }

  const values = entries.map(
    ({ student_id, marks }) =>
      [student_id, subject_id, marks, date, term, year]
  );

  console.log("Values to insert:", values);

  const sql = `
    INSERT INTO studentsubject (Student_ID, Subject_ID, Marks, Date, Term, year)
    VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ message: "Insert error", error: err });
    res.json({ success: true, inserted: result.affectedRows });
  });
};

exports.getSubjectsForClass = (req, res) => {
  const classId = req.classID; // from token/middleware
  const year = req.query.year;

  // For simplicity,  get all subjects for this class/grade 
  const sql = `
    SELECT Subject_ID, Subject_name
    FROM subject
    WHERE Grade = (
      SELECT Grade FROM class WHERE Class_ID = ?
    )
  `;
  db.query(sql, [classId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
};

exports.getStudentsByClassAndYear = (req, res) => {
  const classId = req.classID;    // Set by auth middleware
  const year = req.query.year;    // From frontend query param

  if (!classId || !year) {
    return res.status(400).json({ message: "Missing class or year" });
  }

  // Get all students for this class and year
  const query = `
    SELECT s.Student_ID, s.Full_name
    FROM studentclass sc
    JOIN student s ON sc.Student_ID = s.Student_ID
    WHERE sc.Class_ID = ? AND sc.Academic_year = ?
  `;
  db.query(query, [classId, year], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
};


exports.getOwnSubjectMarks = (req, res) => {
  const studentId = req.userID; // From middleware

  const sql = `
    SELECT
      sub.Subject_name,
      ss.Subject_ID,
      ss.Marks,
      ss.Term,
      ss.Date
    FROM studentsubject ss
    JOIN subject sub ON ss.Subject_ID = sub.Subject_ID
    WHERE ss.Student_ID = ?
    ORDER BY ss.Subject_ID, ss.Term
  `;
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(results);
  });
};