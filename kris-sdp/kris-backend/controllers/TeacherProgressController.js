const TeacherProgressModel = require('../models/TeacherProgressModel');

// Fetch students
// New function for class-specific student list for teacher
exports.getStudentsByClass = (req, res) => {
    const classID = req.classID;
  
    if (!classID) {
      return res.status(403).json({ error: "Class ID missing in token" });
    }
  
    TeacherProgressModel.getStudentsByClass(classID, (err, results) => {
      if (err) {
        console.error("Error fetching students by class:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  };



  // get subjects
exports.getAllSubjects = (req, res) => {
  TeacherProgressModel.getAllSubjects((err, results) => {
    if (err) {
      console.error("Error fetching subjects:", err);
      return res.status(500).json({ message: "Error fetching subjects", error: err });
    }
    console.log("Subjects fetched:", results);  // Log the results
    res.json(results);
  });
};


exports.getProgressByStudent = (req, res) => {
  const studentId = req.params.studentId;

  TeacherProgressModel.getProgressByStudent(studentId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};


// Save or update student marks
exports.saveMark = (req, res) => {
  const { studentId, subjectId, marks } = req.body;

  if (!studentId || !subjectId || marks == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  TeacherProgressModel.saveMark(studentId, subjectId, marks, (err, result) => {
    if (err) {
      console.error("Error saving mark:", err.message);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Mark saved successfully" });
  });
};

//for subjectwise avg
exports.getSubjectWiseAverage = (req, res) => {
  console.log("✅ Controller hit: getSubjectWiseAverage");

  TeacherProgressModel.getSubjectWiseAverage((err, results) => {
    if (err) {
      console.error("❌ SQL error:", err);

      return res.status(500).json({ message: 'Database error', error: err });
    }
    console.log("✅ SQL Results:", results);

    res.json(results);
  });
};

exports.addSubject = (req, res) => {
  const { subjectName } = req.body;

  if (!subjectName || subjectName.trim() === "") {
    return res.status(400).json({ message: "Subject name is required" });
  }

  TeacherProgressModel.addSubject(subjectName.trim(), (err, result) => {
    if (err) {
      console.error("Error adding subject:", err.message);
      return res.status(500).json({ message: "Database error", error: err });
    }

    const newSubject = {
      Subject_ID: result.insertId,
      Subject_name: subjectName
    };

    res.status(200).json(newSubject);
  });
};


//classwise
exports.getSubjectAverageForClass = (req, res) => {
  const classID = req.classID;

  if (!classID) {
    return res.status(403).json({ error: "Class ID missing in token" });
  }

  TeacherProgressModel.getSubjectWiseAverageByClass(classID, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    res.json(results);
  });
};

  //module.exports = { getStudentsByClass};
