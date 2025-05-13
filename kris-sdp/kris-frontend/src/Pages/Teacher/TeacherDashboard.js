import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavbarTeacher';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { Bar } from 'react-chartjs-2';
import Notice from "../Common/Notice";
import MealChart from '../Common/MealChart'; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeacherDashboard = () => {

  const [subjectAverages, setSubjectAverages] = useState([]);

  // ✅ Fetch all student progress data (for subjects and marks)
  useEffect(() => {
    fetch("http://localhost:5001/api/teacher-progress/subject-averages")
      .then((res) => res.json())
      .then((data) => {
        const result = data.map((entry) => ({
          subject: entry.Subject_name,
          average: parseFloat(entry.AverageMarks), 
        }));
        setSubjectAverages(result);
      })
      .catch((err) => console.error("Error fetching progress data:", err));
  }, []);
  
  // ✅ Chart configuration using fetched data
  const performanceData = {
    labels: subjectAverages.map((item) => item.subject),
    datasets: [
      {
        label: 'Average Marks (%)',
        data: subjectAverages.map((item) => item.average),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Class Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="flex min-h-screen">
       {/* Main Content */}
       <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-2 border-b border-gray-300">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex space-x-4">
            <button className="flex items-center bg-gray-200 w-64 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
              <SearchIcon className="mr-2" />
              Search
            </button>
          </div>
          
        </div>
          
        </header>
      
       

        <section className="grid grid-cols-3 gap-4 bg-blue-900">
          {/* Attendance */}
          <div className="bg-gray-100 p-4 mt-3 mx-3 rounded shadow-md text-center">
            <h2 className="text-lg font-bold">Attendance Today</h2>
            <p className="text-2xl font-extrabold">22</p>
          </div>

          {/* Meal Chart */}
          <div className="bg-gray-100 p-4 mt-3 rounded shadow-md">
            <MealChart />

          </div>

          {/* Homework */}
          <div className="bg-gray-100 p-4 mt-3 mx-3 rounded shadow-md">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Upcoming Homework</h2>
              <button className="text-blue-600 hover:text-blue-800">
                  <EditIcon />
                </button>
              </div>
            <p className="text-xl font-extrabold">2 Activities</p>
          </div>

          {/* ✅ Graph: Class Performance */}
          <div className="col-span-3 bg-gray-200 p-4 mx-3 rounded shadow-md">
            <h2 className="text-lg font-bold text-center mb-4">Class Performance</h2>
            <Bar data={performanceData} options={chartOptions} height={70} />
          </div>

          {/* Special Notices */}
          <div className="col-span-3 p-2 mx-3 rounded shadow-md">
            <Notice />
          </div>          
        </section>
    </div>
    </div>
  );
};

export default TeacherDashboard;
