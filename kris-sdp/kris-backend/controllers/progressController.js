const Progress = require('../models/Progress');

exports.addProgress = (req, res) => {
  const { studentId, subjectId, date, marks, average } = req.body;

  Progress.addProgress(studentId, subjectId, date, marks, average, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Progress added successfully' });
  });
};

exports.getProgressByStudent = (req, res) => {
  const studentId = req.params.studentId;

  Progress.getProgressByStudent(studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};

exports.updateProgress = (req, res) => {
  const { studentId, subjectId, marks, average } = req.body;

  Progress.updateProgress(studentId, subjectId, marks, average, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ message: 'Progress updated successfully' });
  });
};

// Inside progressController.js
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
  