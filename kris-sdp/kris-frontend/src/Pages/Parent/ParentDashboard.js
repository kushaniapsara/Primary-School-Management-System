import React, { useEffect, useState } from 'react';
import ParentNavbar from '../../components/ParentNavbar';
import SearchIcon from "@mui/icons-material/Search";
import Notice from "../Common/Notice";
import MealChart from '../Common/MealChart';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ParentDashboard = () => {
  const [progress, setProgress] = useState([]);

  const [upcomingHomeworkCount, setUpcomingHomeworkCount] = useState(0);

  // NEW: Attendance Percentage state
  const [attendancePercent, setAttendancePercent] = useState(null);


  // Fetch student progress data
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/progress/me", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const studentId = res.data.studentId;
        fetch(`http://localhost:5001/api/progress/${studentId}`)
          .then((res) => res.json())
          .then((data) => setProgress(Array.isArray(data) ? data : []))
          .catch((err) => console.error("Error fetching progress:", err));

          
     // NEW: Fetch attendance percentage for this student
        fetch(`http://localhost:5001/api/attendance/student/${studentId}/percentage`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.percentage !== undefined) {
              setAttendancePercent(data.percentage.toFixed(2));
            } else {
              setAttendancePercent("N/A");
            }
          })
          .catch((err) => {
            console.error("Error fetching attendance percentage:", err);
            setAttendancePercent("N/A");
          });
      })
      .catch((err) => {
        console.error("Auth error:", err);
        alert("Authentication failed. Please log in again.");
      });
  }, []);

  // Format chart data based on fetched progress
  const performanceData = {
    labels: progress.map(item => item.Subject_name),
    datasets: [
      {
        label: 'Marks (%)',
        data: progress.map(item => item.Marks),
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
        text: 'Student Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };


  //homework count
  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/homework", {
          headers: { Authorization: token },
        });

        const upcomingCount = response.data.filter(
          (hw) => new Date(hw.Due_date) > new Date()
        ).length;

        setUpcomingHomeworkCount(upcomingCount);
      } catch (error) {
        console.error("Failed to fetch homework data", error);
      }
    };

    fetchHomeworks();
  }, []);


  
  return (
    <div className="flex min-h-screen">
      {/* <ParentNavbar /> */}
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
            <h2 className="text-lg font-bold">Attendance</h2>
            <p className="text-2xl font-extrabold">
              {attendancePercent === null ? "Loading..." : `${attendancePercent}%`}
            </p>
          </div>

          {/* Meal Chart */}
          <div className="bg-gray-100 p-4 mt-3 rounded shadow-md">
            <MealChart />
          </div>

          {/* Homework */}
          <div className="bg-gray-200 shadow-md rounded-md p-4 mx-4 my-4 flex flex-col items-center justify-center h-40">
            <h2 className="text-lg font-bold text-black">Upcoming Homeworks</h2>
            <p className="text-gray-700 mt-2 text-3xl">{upcomingHomeworkCount}</p>
          </div>

          {/* Graph: Class Performance */}
          <div className="col-span-3 bg-gray-200 p-4 mx-3 rounded shadow-md">
            <h2 className="text-lg font-bold text-center mb-4">Performance</h2>
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

export default ParentDashboard;
