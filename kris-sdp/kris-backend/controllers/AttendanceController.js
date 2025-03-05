const AttendanceModel = require('../models/AttendanceModel');

// Fetch students
const getStudents = (req, res) => {
    AttendanceModel.getStudents((error, students) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch students' });
            return;
        }
        res.json(students);
    });
};

// Fetch attendance records for the last 5 days
const getAttendance = (req, res) => {
    AttendanceModel.getAttendance((error, attendance) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch attendance' });
            return;
        }
        res.json(attendance);
    });
};

// Save attendance records
const saveAttendance = (req, res) => {
    const { date, attendance } = req.body;

    AttendanceModel.saveAttendance(date, attendance, (error, result) => {
        if (error) {
            res.status(500).json({ error: 'Error saving attendance' });
            return;
        }

        res.status(200).json({ message: 'Attendance saved successfully' });
    });
};

module.exports = { getStudents, getAttendance, saveAttendance };
