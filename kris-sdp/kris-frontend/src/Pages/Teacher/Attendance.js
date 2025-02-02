import React, { useState } from 'react';
import Navbar from '../../components/NavbarTeacher';
import axios from 'axios';  // Make sure to import axios for sending HTTP requests

const students = [
  'Kushani', 'Kavindu', 'Apsara', 'Thulini', 'Sandani', 'Dinithi', 'Koshali', 'Tharindu', 'Shenal', 'Nimeshika'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

// Status Mapping: 'green' -> Present (1), 'pink' -> Absent (0)
const statusMap = {
  'green': 1,  // Present
  'pink': 0,   // Absent
};

function Attendance() {
  const [todayAttendance, setTodayAttendance] = useState(
    Array(students.length).fill('')  // Initialize attendance with empty string
  );

  const handleCellClick = (index) => {
    setTodayAttendance((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] === 'green' ? '' : 'green';  // Toggle status
      return updated;
    });
  };

  const handleSave = async () => {
    // Create attendance data with student IDs and status (0 or 1)
    const attendanceData = students.map((student, i) => ({
      student_id: i + 1,  // Example: student_id should be mapped correctly to your DB
      status: statusMap[todayAttendance[i]] || 0,  // Default to 0 (Absent) if no status
    }));

    const date = new Date().toISOString();  // Current date in ISO format

    try {
      const response = await axios.post('http://your-backend-url/attendance', {
        date: date,
        attendance: attendanceData,  // Array of student IDs and their status
      });

      if (response.status === 200) {
        alert('Attendance saved successfully!');
      } else {
        alert('Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Daily Attendance</h1>
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
        </header>

        {/* Attendance Section with Blue Background */}
        <div className="bg-blue-900 p-4 rounded-lg">
          {/* Attendance Table */}
          <div className="overflow-x-auto bg-gray-200 p-4 rounded-lg">
            <table className="table-auto w-full border-separate border-spacing-2 border border-blue-500 shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-400 p-2 rounded-md">Student Name</th>
                  {days.map(day => (
                    <th key={day} className="border border-blue-400 p-2 rounded-md">{day}</th>
                  ))}
                  <th className="border border-blue-400 p-2 rounded-md">Today</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student} className="hover:bg-gray-100 transition">
                    <td className="border border-blue-300 p-2 rounded-md">{student}</td>
                    {days.map(day => (
                      <td key={day} className="border border-blue-300 p-2 bg-green-200 rounded-md"></td>
                    ))}
                    <td
                      className={`border border-blue-300 p-2 cursor-pointer rounded-md ${todayAttendance[i] === 'green' ? 'bg-green-400' : todayAttendance[i] === 'pink' ? 'bg-pink-400' : 'bg-white'}`}
                      onClick={() => handleCellClick(i)}
                    ></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Advance</button>
            <span className="text-white">Total: {students.length}</span>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save and Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
