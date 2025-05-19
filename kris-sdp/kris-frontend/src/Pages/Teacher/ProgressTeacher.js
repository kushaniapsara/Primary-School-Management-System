import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Navbar from "../../components/NavbarTeacher";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



// Registering necessary chart components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [studentAverages, setStudentAverages] = useState([]);
  const [studentProgressData, setStudentProgressData] = useState({}); // studentID -> subject marks
  const [studentId, setStudentId] = useState(null); // Or a default ID like 1

  const [progress, setProgress] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [newSubject, setNewSubject] = useState("");



  useEffect(() => {
    fetchStudents();
  }, []);


  useEffect(() => {
    if (students.length > 0) {
      const fetchProgressForAllStudents = async () => {
        try {
          const allProgress = {};
          for (const student of students) {
            const res = await fetch(`http://localhost:5001/api/progress/${student.Student_ID}`);
            const data = await res.json();
            allProgress[student.Student_ID] = data;
          }
          setStudentProgressData(allProgress);
        } catch (err) {
          console.error("Error fetching progress for all students:", err);
        }
      };

      fetchProgressForAllStudents();
    }
  }, [students]);


  useEffect(() => {
    fetch("http://localhost:5001/api/teacher-progress/subjects")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched subjects:", data); // Check if subjects are received
        setSubjects(data);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);


  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage (or wherever you store it)

      const response = await axios.get('http://localhost:5001/api/students/by-class', {
        headers: {
          Authorization: token,
        },
      });

      console.log('Fetched Students:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  //view student profiles
  const handleViewStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/students');
      if (response.status === 200) {
        localStorage.setItem('students', JSON.stringify(response.data));
        navigate('/StudentProfiles');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching student profiles');
    }
  };



  const handleMarkChange = (studentId, subjectId, newMark) => {
    setStudentProgressData(prev => {
      const updated = { ...prev };

      if (!updated[studentId]) updated[studentId] = [];

      const subjectIndex = updated[studentId].findIndex(p => p.Subject_ID === subjectId);

      if (subjectIndex > -1) {
        updated[studentId][subjectIndex].Marks = Number(newMark);
      } else {
        updated[studentId].push({
          Student_ID: studentId,
          Subject_ID: subjectId,
          Marks: Number(newMark),
        });
      }

      return updated;
    });
  };



  const handleSaveMarks = async () => {
    try {
      for (const studentId in studentProgressData) {
        for (const subjectData of studentProgressData[studentId]) {
          await axios.post(`http://localhost:5001/api/teacher-progress/save-mark`, {
            studentId: subjectData.Student_ID,
            subjectId: subjectData.Subject_ID,
            marks: subjectData.Marks,
          });
        }
      }

      alert("Marks saved successfully!");
    } catch (err) {
      console.error("Error saving marks:", err.response?.data || err.message || err);
      alert("Something went wrong while saving marks.");
    }

  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      alert("Subject name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/teacher-progress/add-subject", {
        subjectName: newSubject,
      });

      if (response.status === 200) {
        alert("Subject added successfully!");
        setNewSubject(""); // Clear input
        setSubjects(prev => [...prev, response.data]); // Append new subject to the list
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject.");
    }
  };


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen">

        {/* Main Content */}
        <div className="flex-1 bg-blue-900">
          {/* Header */}
          <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
            <h1 className="text-2xl font-bold">Progress</h1>

          </header>




          <div className="col-span-1 bg-gray-200 mt-4 mx-4 p-4 rounded-md h-96 overflow-auto  ">
            <h2 className="text-lg font-bold mb-4">Average Marks of Students of the Class</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Name</th>
                  {subjects.map((subject, index) => (
                    <th key={index} className="text-left py-2">{subject.Subject_name}</th>
                  ))}
                  <th className="text-left py-2">Average</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => {
                  const studentProgress = studentProgressData[student.Student_ID] || [];

                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-1">{student.Full_name}</td>

                      {subjects.map((subject, i) => {
                        const subjectData = studentProgress.find(p => p.Subject_ID === subject.Subject_ID);
                        const value = subjectData ? subjectData.Marks : '';

                        return (
                          <td key={i} className="py-1">
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleMarkChange(student.Student_ID, subject.Subject_ID, e.target.value)}
                              className="w-16 p-1 rounded border"
                            />
                          </td>
                        );
                      })}

                      {/* average cell if you want to keep it */}
                      <td className="py-1">
                        {(studentProgress.length
                          ? (studentProgress.reduce((sum, p) => sum + p.Marks, 0) / studentProgress.length).toFixed(2)
                          : "N/A")}
                      </td>
                    </tr>
                  );
                })}

              </tbody>



            </table>
          </div>



          <div className="grid grid-cols-3 gap-6">
            <div>
              <button
                onClick={handleSaveMarks}
                className="mt-4 mx-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Save All Marks
              </button>
            </div>


            <div>
              <button
                onClick={handleViewStudents}
                className="w-auto bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 mt-4 mx-4">
                View Student Profiles
              </button>
            </div>

            <div className="mt-4 mx-4 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Add New Subject</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Subject Name"
                  className="border rounded p-2 w-60"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <button
                  onClick={handleAddSubject}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
