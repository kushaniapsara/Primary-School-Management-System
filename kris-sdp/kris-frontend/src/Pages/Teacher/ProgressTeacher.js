import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
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

  

 useEffect(() => {
    fetchStudents();
  }, []);

  const studentData = [
    { subject: "Math", avgMarks: 80 },
    { subject: "Science", avgMarks: 85 },
    { subject: "English", avgMarks: 82 },
    { subject: "History", avgMarks: 68 },
    { subject: "Art", avgMarks: 86 },
    { subject: "Sinhala", avgMarks: 51 },
    { subject: "Environment", avgMarks: 90 },
    { subject: "Geography", avgMarks: 88 },
    { subject: "Geography", avgMarks: 88 },
    { subject: "Geography", avgMarks: 88 },
    { subject: "Geography", avgMarks: 88 },
    { subject: "Geography", avgMarks: 88 },



  ];

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

  // Data for the bar chart
  const chartData = {
    labels: studentData.map(data => data.subject),
    datasets: [
      {
        label: "Girls",
        data: [75, 80, 70, 60, 85], // Example data for Girls
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Boys",
        data: [85, 90, 80, 75, 88], // Example data for Boys
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Purple color
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Overall Class Performance",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Subjects",
        },
      },
      y: {
        title: {
          display: true,
          text: "Marks",
        },
      },
    },
    
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




        <div className="col-span-1 bg-gray-200 mt-4 mx-4 p-4 rounded-md h-96 overflow-auto w-1/3 ">
            <h2 className="text-lg font-bold mb-4">Average Marks of Students of the Class</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Maths</th>
                  <th className="text-left py-2">English</th>
                  <th className="text-left py-2">Environment</th>
                  <th className="text-left py-2">Sinhala</th>
                  <th className="text-left py-2">Religion</th>
                  <th className="text-left py-2">English</th>




                  <th className="text-left py-2">Average</th>

                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-1">{student.Full_name}</td>
                    <td className="py-1">{student.Average || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>



         <div className="grid grid-cols-3 gap-6">
          {/* Table Section */}
          <div className="col-span-1 bg-gray-200 mt-4 mx-4 p-4 rounded-md h-96 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Subject Average Marks</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Subject</th>
                  <th className="text-left py-2">Avg Marks</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-1">{data.subject}</td>
                    <td className="py-1">{data.avgMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart Section */}
          <div className="col-span-2 bg-gray-200 p-4 mt-4 mx-4 rounded-md h-96">
            <h2 className="text-lg font-bold mb-4">Overall Class Performance</h2>
            <div className="h-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Average */}
        <div className="mt-6 grid grid-cols-2 gap-6 mx-4">
          <div className="col-span-1 bg-gray-200 p-4 rounded-md">
            <h2 className="text-lg font-bold">Average</h2>
            <div className="h-24 bg-white mt-4"></div>

          </div>

         
          <div>
          <button
              onClick={handleViewStudents}
              className="w-auto bg-blue-500 text-white p-3 rounded-md cursor-pointer hover:bg-blue-600 mt-4">
            View Student Profiles
          </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
