import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavbarTeacher';
import axios from 'axios';

const statusMap = {
  1: 'green',  // Present
  0: 'pink',   // Absent
};

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [todayAttendance, setTodayAttendance] = useState({});
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
    generateLastFiveDays();
  }, []);

  // Get last 4 days + today dynamically
  const generateLastFiveDays = () => {
    const today = new Date();
    const lastFiveDays = [];
  
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
  
      // If it's today, label it "Today"
      lastFiveDays.push(i === 0 ? "Today" : formattedDate);
    }
  
    setDates(lastFiveDays);
  };
  

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/students');
      console.log('Fetched Students:', response.data);  // Log to check if the new student is included
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  

  // Fetch attendance records for the last 5 days
  const fetchAttendance = async () => {
    try {
        const response = await axios.get('http://localhost:5001/api/attendance');
        console.log('Fetched Attendance:', response.data); // Debugging step

        const fetchedAttendance = {};
        response.data.forEach(record => {
            if (!fetchedAttendance[record.Student_ID]) {
                fetchedAttendance[record.Student_ID] = {
                    name: record.Full_name,
                    records: {}
                };
            }
            fetchedAttendance[record.Student_ID].records[record.Date] = record.Status || ''; // Ensure previous data is set
        });

        setAttendanceData(fetchedAttendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
    }
};



  // Toggle today's attendance status
  const handleCellClick = (studentId) => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'green' ? 'pink' : 'green', // Toggle between present/absent
    }));
  };

  // Save today's attendance
  const handleSave = async () => {
    const date = new Date().toISOString().split('T')[0];
  
    // Create a new attendance object and mark unmarked students as Absent (pink)
    const updatedAttendance = { ...todayAttendance };
  
    // Ensure every student, including new ones, is included in the attendance data
    students.forEach(student => {
      if (!(student.Student_ID in updatedAttendance)) {
        updatedAttendance[student.Student_ID] = 'pink'; // Default unmarked to Absent
      }
    });
  
    // Update UI immediately before sending request
    setTodayAttendance(updatedAttendance);
  
    // Convert colors to database-friendly format (1 for Present, 0 for Absent)
    const formattedAttendance = students.map(student => ({
      student_id: student.Student_ID,
      status: updatedAttendance[student.Student_ID] === 'green' ? 1 : 0,
    }));
  
    console.log('Formatted Attendance:', formattedAttendance);  // Debugging line
  
    try {
      const response = await axios.post('http://localhost:5001/api/attendance', {
        date: date,
        attendance: formattedAttendance,
      });
  
      console.log('Attendance saved:', response.data); // Debugging line
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance');
    }
  };
  


  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 bg-blue-900">
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Daily Attendance</h1>
        </header>

        <div className="bg-blue-900 p-4 rounded-lg">
          <div className="overflow-x-auto bg-gray-200 p-4 rounded-lg">
            <table className="table-auto w-full border-separate border-spacing-2 border border-blue-500 shadow-md rounded-lg">
            <thead>
                <tr className="bg-blue-100">
                <th className="border border-blue-400 p-2 rounded-md">Student Name</th>
                {dates.map(date => (
                <th key={date} className="border border-blue-400 p-2 rounded-md">{date}</th>
                ))}
                </tr>
            </thead>
            <tbody>
  {students.map(student => (
    <tr key={student.Student_ID} className="hover:bg-gray-100 transition">
      <td className="border border-blue-300 p-2 rounded-md">{student.Full_name}</td>

      {/* Display previous attendance records */}
      {dates.slice(0, -1).map(date => (
        <td
          key={date}
          className={`border border-blue-300 p-2 rounded-md ${
            attendanceData[student.Student_ID]?.records[date] 
              ? (attendanceData[student.Student_ID]?.records[date] === 'Present' ? 'bg-green-400' : 'bg-pink-400') 
              : 'bg-white'
          }`}
        >
          {attendanceData[student.Student_ID]?.records[date] || ''}
        </td>
      ))}

      {/* Today’s Attendance (Clickable) */}
      <td
        className={`border border-blue-300 p-2 cursor-pointer rounded-md ${
          todayAttendance[student.Student_ID] === 'green' ? 'bg-green-400' :
          todayAttendance[student.Student_ID] === 'pink' ? 'bg-pink-400' :
          'bg-white'
        }`}
        onClick={() => handleCellClick(student.Student_ID)}
      ></td>
    </tr>
  ))}
</tbody>



            </table>
          </div>

          {/* Footer */}
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
