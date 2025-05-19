import React, { useEffect, useState } from "react";
//import Navbar from "../../components/AdminNavbar";
import axios from "axios";
import MealChart from '../Common/MealChart';


import SearchIcon from "@mui/icons-material/Search";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Notice from "../Common/Notice";


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Performance Bar Chart Data
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
        text: 'Subject Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Attendance Line Chart Data (With Scatter Points)
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/attendance-chart") // Adjust endpoint if needed
      .then((res) => {
        console.log("Chart Data:", res.data); // Debugging log

        const formattedData = res.data.map(item => ({
          date: item.formattedDate, // Ensure formatted date is used
          percentage: item.percentage || 0, // Avoid undefined values
        }));

        setAttendanceData(formattedData);
      })
      .catch((err) => {
        console.error("Error fetching attendance data:", err);
      });
  }, []);


  const attendanceChartData = {
    labels: attendanceData.map((record) => record.date), // Use `date`
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map((record) => record.percentage),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
      },
    ],
  };


  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Overall Attendance Trend (Last 5 Days)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Attendance (%)" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };


  return (

    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex min-h-screen">
        {/* <Navbar />  */}
        {/* Main Content */}
        <div className="flex-1 bg-blue-900">
          {/* Header */}
          <header className="flex justify-between items-center bg-white px-8 py-2 border-b border-gray-300">
            <div className="flex justify-between items-center px-8 py-4">
              {/* <div className="flex space-x-4">
              <button className="flex items-center bg-gray-200 w-64 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
                <SearchIcon className="mr-2" />
                Search
              </button>
            </div> */}
            </div>

          </header>

          {/* Performance Graph & Attendance Chart Section */}
          <section className="grid grid-cols-2 gap-4 bg-blue-900 p-4">
            {/* Performance Graph */}
            <div className="bg-gray-200 p-4 rounded shadow-md h-[360px]">
              <h2 className="text-lg font-bold text-center mb-4">Performance</h2>
              {/* ✅ Graph: Class Performance */}
              <div className="col-span-3 bg-gray-200 p-4 mx-3 rounded shadow-md">
                <Bar data={performanceData} options={chartOptions} height={160} />
              </div>
            </div>

            {/* Attendance Line Chart (Previously Scatter Plot) */}
            <div className="bg-gray-200 p-4 rounded shadow-md h-[360px]">
              <h2 className="text-lg font-bold text-center mb-4">Attendance</h2>
              <div className="h-[300px]">
                <Line data={attendanceChartData} options={attendanceChartOptions} />
              </div>
            </div>
          </section>

          {/* Special Notices & Meal Chart Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="bg-gray-100 p-4 rounded shadow-md md:col-span-2">
              <Notice />
            </div>
            <div className="bg-gray-100 p-4 rounded shadow-md">
              <MealChart />
            </div>
          </section>


          {/* <section className="bg-gray-100 p-4 mx-3 rounded shadow-md mb-4">
          <h2 className="text-lg font-bold">Special Notices</h2>
          <ul className="space-y-2">
            <li className="bg-white px-4 py-2 rounded">
              Annual English Day of KRIS Kegalle will be held on 20th December 2024
            </li>
            <li className="bg-white px-4 py-2 rounded">
              Applications for new intake will be closed on 16th November 2024
            </li>
            <li className="bg-white px-4 py-2 rounded">
              Chess class will be held every Sunday from 3rd November 2024
            </li>
          </ul>
        </section>*/}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
