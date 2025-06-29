import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavbarTeacher';
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { Bar } from 'react-chartjs-2';
import Notice from "../Common/Notice";
import MealChart from '../Common/MealChart';
import axios from "axios";


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

  const [upcomingHomeworkCount, setUpcomingHomeworkCount] = useState(0);

  //for attendance
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);



  // ✅ Fetch all student progress data (for subjects and marks)
  useEffect(() => {
    fetch("http://localhost:5001/api/teacher-progress/subject-averages")
    //    fetch("http://localhost:5001/api/teacher-progress/subject-averages-byclass")

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

  //attendance count
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch students of the class
        const studentRes = await axios.get("http://localhost:5001/api/students/by-class", {
          headers: { Authorization: token },
        });

        const classStudents = studentRes.data; // contains Full_name and Student_ID
        const classStudentIds = classStudents.map((s) => s.Student_ID);

        // Fetch attendance records
        const { data: attendance } = await axios.get("http://localhost:5001/api/attendance", {
          headers: { Authorization: token },
        });

        const getLocalDateString = (d = new Date()) => {
          const local = new Date(d);
          local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
          return local.toISOString().split("T")[0];
        };

        const today = getLocalDateString();

        // Filter attendance for today and only for class students
        const todayAttendance = attendance.filter((entry) => {
          const entryDate = getLocalDateString(new Date(entry.Date));
          return (
            entryDate === today && classStudentIds.includes(entry.Student_ID)
          );
        });

        const presentCount = todayAttendance.filter(
          (e) => e.Status === "Present" || e.Status === 1
        ).length;

        const absentCount = todayAttendance.filter(
          (e) => e.Status === "Absent" || e.Status === 0
        ).length;

        const totalCount = classStudentIds.length;

        setTotalStudents(totalCount);
        setPresentToday(presentCount);
        setAbsentToday(absentCount);
      } catch (err) {
        console.error("Failed to fetch attendance data", err);
      }
    };

    fetchAttendanceSummary();
  }, []);




  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 bg-blue-900">
          {/* Header */}
          <header className="flex justify-between items-center bg-white px-8 py-2 border-b border-gray-300">
            <div className="flex justify-between items-center px-8 py-4">
              

            </div>

          </header>



          <section className="grid grid-cols-3 gap-4 bg-blue-900">
            {/* Attendance */}
            {/* Attendance Summary Card */}
            <div className="bg-white text-blue-900 rounded-xl shadow-lg p-6 mt-3 mx-3 w-full">
              <h2 className="text-lg font-bold mb-4 text-center">Today's Attendance</h2>
              <div className="space-y-2 text-center">
                <p className="font-semibold">
                  Total Students: <span className="text-black">{totalStudents}</span>
                </p>
                <p className="font-semibold">
                  Present Today: <span className="text-green-600">{presentToday}</span>
                </p>
                <p className="font-semibold">
                  Absent Today: <span className="text-red-600">{absentToday}</span>
                </p>
              </div>
            </div>



            {/* Meal Chart */}
            <div className="bg-gray-100 p-4 mt-3 rounded shadow-md">
              <MealChart />

            </div>

            {/* Homework */}
            <div className="bg-gray-200 shadow-md rounded-md p-4 mx-4 my-4 flex flex-col items-center justify-center h-40">
              <h2 className="text-lg font-bold text-black">Upcoming Homeworks</h2>
              <p className="text-black font-bold mt-2 text-3xl ">{upcomingHomeworkCount}</p>
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
    </div>
  );
};

export default TeacherDashboard;
