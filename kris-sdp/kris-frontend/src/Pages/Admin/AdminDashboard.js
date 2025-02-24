import React from "react";
import Navbar from "../../components/AdminNavbar";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const TeacherDashboard = () => {
  // Performance Bar Chart Data
  const performanceData = {
    labels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    datasets: [
      {
        label: "Average Marks (%)",
        data: [85, 78, 92, 74, 88],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Performance" },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  // Attendance Line Chart Data (With Scatter Points)
  const attendanceData = {
    labels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    datasets: [
      {
        label: "Boys",
        data: [48, 50, 92, 74, 88],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        showLine: true, // Ensures the line is drawn
      },
      {
        label: "Girls",
        data: [50, 82, 95, 80, 89],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        showLine: true, // Ensures the line is drawn
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Boys vs. Girls Attendance (%)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Attendance (%)" },
      },
    },
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
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
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
        </header>

        {/* Performance Graph & Attendance Chart Section */}
        <section className="grid grid-cols-2 gap-4 bg-blue-900 p-4">
          {/* Performance Graph */}
          <div className="bg-gray-200 p-4 rounded shadow-md h-[400px]">
            <h2 className="text-lg font-bold text-center mb-4">Performance</h2>
            <div className="h-[300px]">
              <Bar data={performanceData} options={chartOptions} />
            </div>
          </div>

          {/* Attendance Line Chart (Previously Scatter Plot) */}
          <div className="bg-gray-200 p-4 rounded shadow-md h-[400px]">
            <h2 className="text-lg font-bold text-center mb-4">Attendance</h2>
            <div className="h-[300px]">
              <Line data={attendanceData} options={lineOptions} />
            </div>
          </div>
        </section>

        {/* Special Notices */}
        <section className="bg-gray-100 p-4 mx-3 rounded shadow-md mb-4">
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
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
