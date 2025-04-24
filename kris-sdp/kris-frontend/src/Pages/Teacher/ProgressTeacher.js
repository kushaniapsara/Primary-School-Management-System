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
        fetch("http://localhost:5001/api/progress/subjects")
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

  

  
  return (
    <div className="flex h-screen">
      <Navbar/>

     {/* Main Content */}
     <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Progress</h1>
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
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

                      const subjectMarks = subjects.map(subject => {
                        const subjectData = studentProgress.find(p => p.Subject_ID == subject.Subject_ID);
                        return subjectData ? subjectData.Marks : "N/A";
                      });

                      const average = studentProgress.length
                        ? (studentProgress.reduce((sum, p) => sum + p.Marks, 0) / studentProgress.length).toFixed(2)
                        : "N/A";

                      return (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-1">{student.Full_name}</td>
                          {subjectMarks.map((mark, i) => (
                            <td key={i} className="py-1">{mark}</td>
                          ))}
                          <td className="py-1">{average}</td>
                        </tr>
                      );
                    })}
                  </tbody>



            </table>
          </div>



         <div className="grid grid-cols-3 gap-6">
          
          <div>
          <button
              onClick={handleViewStudents}
              className="w-auto bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 mt-4 mx-4">
            View Student Profiles
          </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
