const path = require('path');
const fs = require('fs');
const generatePdf = require('../utils/generatePdf');
const generateExcel = require('../utils/generateExcel');
const db = require('../config/db');
const generateLeavingCertificate = require('../utils/generateLeavingCertificate');


exports.generateReport = async (req, res) => {
  const { fromDate, toDate, format, reportType } = req.body;

  let sql = '';
  let params = [fromDate, toDate];

  // Pick the correct SQL based on report type
  switch (reportType) {
    case 'attendance':
      sql = 'SELECT Student_ID, Date, Status FROM Attendance WHERE Date BETWEEN ? AND ?';
      params = [];
      break;

    case 'student':
      sql = 'SELECT Student_ID, Full_name, Grade FROM Student'; // No date filter here
      params = []; // No params needed
      break;

    case 'extra-curricular':
      sql = 'SELECT Activity_name, Teacher_incharge, Location FROM ExtraCurricularActivity';
      params = [];
      break;

    case 'payment':
      sql = 'SELECT Student_ID, Amount, Paid_Date FROM Payment WHERE Paid_Date BETWEEN ? AND ?';
      params = [];
      break;

    default:
      return res.status(400).send({ error: 'Invalid report type' });
  }

  db.query(sql, params, async (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).send({ error: 'Database error' });
    }

    const timestamp = Date.now();
    const filename = `report_${reportType}_${timestamp}.${format.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx'}`;


    const filePath = path.join(__dirname, '..', 'downloads', filename);

    try {
      let buffer;
      if (format.toLowerCase() === 'pdf') {
        buffer = await generatePdf(results, fromDate, toDate, reportType);
      } else if (format.toLowerCase() === 'excel') {
        buffer = await generateExcel(results, fromDate, toDate, reportType);
      } else {
        return res.status(400).send({ error: 'Invalid format' });
      }

      fs.writeFileSync(filePath, buffer);
      //res.send({ success: true, file: filename });s

      // Send the file path for previewing, not downloading immediately
      res.send({
        success: true,
        file: filename,  // For preview
        fileUrl: `/api/report/download/${filename}` // URL for preview
      });


    } catch (err) {
      console.error('Report generation error:', err);
      res.status(500).send({ error: 'Failed to generate report' });
    }
  });
};

// 🆕 Leaving Certificate Generator
exports.generateLeavingCertificate = async (req, res) => {
  const {
    studentName,
    admissionNo,
    dateOfAdmission,
    dateOfLeaving,
    conduct,
    reason,
    classCompleted,
  } = req.body;

  const timestamp = Date.now();
  const filename = `leaving_certificate_${timestamp}.pdf`;
  const filePath = path.join(__dirname, '..', 'downloads', filename);

  try {
    const buffer = await generateLeavingCertificate({
      Full_Name: studentName,

  Start_Date: dateOfAdmission,
  End_Date: dateOfLeaving,
  Conduct: conduct,
  Grade: classCompleted,
  Issue_Date: new Date().toISOString().split('T')[0],
  Reason: reason,

});

    fs.writeFileSync(filePath, buffer);

    res.send({
      success: true,
      file: filename,
      fileUrl: `/api/report/download/${filename}`
    });

  } catch (err) {
    console.error('Leaving certificate error:', err);
    res.status(500).send({ error: 'Failed to generate leaving certificate' });
  }
  
};

exports.getStudents = (req, res) => {
  const query = 'SELECT Student_ID AS student_id, Full_name AS student_name FROM Student';
  db.query(query, (err, results) => {
    if (err) {
      console.error('SQL Error:', err); 
    return res.status(500).json({ success: false, message: 'DB error' });
  }
  res.json({ success: true, students: results });
});
};

exports.getStudentDetails = (req, res) => {
  const { studentId } = req.params;

  const studentQuery = `
    SELECT 
      Full_name AS student_name, 
      Student_ID AS student_id, 
      Joined_date AS admission_date
    FROM Student 
    WHERE Student_ID = ?
  `;

  const activityQuery = `
    SELECT 
      eca.Activity_name, 
      seca.Awards 
    FROM StudentExtraCurricularActivity seca
    JOIN ExtraCurricularActivity eca ON seca.Activity_ID = eca.Activity_ID
    WHERE seca.Student_ID = ?
  `;

  db.query(studentQuery, [studentId], (err, studentResults) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = studentResults[0];

    db.query(activityQuery, [studentId], (err, activityResults) => {
      if (err) {
        console.error('Activity Query Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      student.activities = activityResults; // Attach extracurricular data

      return res.json({
        success: true,
        student
      });
    });
  });
};
