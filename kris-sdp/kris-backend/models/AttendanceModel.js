const db = require("../config/db");

// Fetch students from the database
const getStudents = (callback) => {
    db.query('SELECT Student_ID, Full_name FROM Student', (error, results) => {
        if (error) {
            console.error('Error fetching students:', error);
            return callback(error, null);
        }
        callback(null, results);
    });
};

// Fetch attendance records for the last 5 days
const getAttendance = (callback) => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);
  const formattedDate = fiveDaysAgo.toISOString().split('T')[0];

  const query = `
      SELECT s.Student_ID, s.Full_name, a.Date, a.Status
      FROM Attendance a
      JOIN Student s ON a.Student_ID = s.Student_ID
      WHERE a.Date >= DATE_SUB(CURDATE(), INTERVAL 4 DAY)
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




module.exports = { getStudents, getAttendance, saveAttendance };
