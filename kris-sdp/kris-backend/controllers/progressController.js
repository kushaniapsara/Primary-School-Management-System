const Progress = require('../models/Progress');

/*exports.addProgress = (req, res) => {
  const { studentId, subjectId, date, marks, average } = req.body;

  Progress.addProgress(studentId, subjectId, date, marks, average, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Progress added successfully' });
  });
};*/

exports.getProgressByStudent = (req, res) => {
  const studentId = req.params.studentId;

  Progress.getProgressByStudent(studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

/*exports.updateProgress = (req, res) => {
  const { studentId, subjectId, marks, average } = req.body;

  Progress.updateProgress(studentId, subjectId, marks, average, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Progress updated successfully' });
  });
};*/

// get subjects
exports.getAllSubjects = (req, res) => {
    Progress.getAllSubjects((err, results) => {
      if (err) {
        console.error("Error fetching subjects:", err);
        return res.status(500).json({ message: "Error fetching subjects", error: err });
      }
      console.log("Subjects fetched:", results);  // Log the results
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


