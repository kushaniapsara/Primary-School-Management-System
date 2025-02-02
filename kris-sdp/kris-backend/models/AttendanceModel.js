/*const db = require('../db');  // Your DB connection

// Function to insert attendance into the database
const saveAttendance = async (attendanceData) => {
  try {
    // Insert attendance data into the 'attendance' table
    const queries = attendanceData.map(entry => {
      const { student_id, date, status } = entry;
      return db.query(
        'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
        [student_id, date, status]
      );
    });

    // Execute all queries
    await Promise.all(queries);
    return true;  // Indicating success
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw new Error('Failed to save attendance');
  }
};

module.exports = { saveAttendance };*/
