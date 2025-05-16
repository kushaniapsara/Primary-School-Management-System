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
  db.query(sql, [classID], (err, results) => {
    if (err) {
      console.error("DB query error:", err);
      return callback(err, null);
    }
    console.log("DB query results:", results);
    callback(null, results);
  });
};

// Fetch attendance records for the last 5 days
const getAttendance = (callback) => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);
  const formattedDate = fiveDaysAgo.toISOString().split('T')[0];

  const query = `
     SELECT s.Student_ID, s.Full_name, DATE(a.Date) AS Date, 
       CASE WHEN a.Status = 1 THEN 'Present' ELSE 'Absent' END AS Status
FROM Attendance a
JOIN Student s ON a.Student_ID = s.Student_ID
WHERE a.Date >= CURDATE() - INTERVAL 4 DAY
ORDER BY a.Date ASC;

  `;

  db.query(query, [formattedDate], (error, results) => {
      if (error) {
          console.error('Error fetching attendance:', error);
          return callback(error, null);
      }
      callback(null, results);
  });
};


// Save attendance records to the database
const saveAttendance = (date, attendanceData, callback) => {
  console.log('Saving Attendance:', attendanceData);  // Debugging line

  const queries = attendanceData.map(entry => 
    new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Attendance (Student_ID, Date, Status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Status = VALUES(Status)',
        [entry.student_id, date, entry.status],
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    })
  );

  Promise.all(queries)
    .then(() => callback(null, true))
    .catch(error => {
      console.error('Error saving attendance:', error);
      callback(error, null);
    });
};

//for dashboard
const getAttendanceChartData = (callback) => {
  const query = `
    SELECT 
      DATE_FORMAT(Date, '%Y-%m-%d') AS formattedDate,  -- Format Date
      COUNT(*) AS total,
      SUM(Status = 1) AS present,
      ROUND(SUM(Status = 1) / COUNT(*) * 100, 2) AS percentage
    FROM Attendance
    WHERE Date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY)
    GROUP BY formattedDate
    ORDER BY formattedDate ASC;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching attendance:', error);
      return callback(error, null);
    }
    callback(null, results);
  });
};



// In your attendanceController.js





module.exports = { getStudentsByClass, getAttendance, saveAttendance, getAttendanceChartData };
