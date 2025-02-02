/*const AttendanceModel = require('../models/AttendanceModel');

// Controller function to handle saving attendance data
const saveAttendance = async (req, res) => {
  const { date, attendance } = req.body;

  try {
    // Transform attendance data before saving it (e.g., add student_id and status)
    const attendanceData = attendance.map(entry => ({
      student_id: entry.student_id,
      date: date,
      status: entry.status,
    }));

    // Call the model function to save attendance
    const result = await AttendanceModel.saveAttendance(attendanceData);

    if (result) {
      return res.status(200).send('Attendance saved successfully');
    } else {
      return res.status(500).send('Error saving attendance');
    }
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).send('Error saving attendance');
  }
};

module.exports = { saveAttendance };*/
