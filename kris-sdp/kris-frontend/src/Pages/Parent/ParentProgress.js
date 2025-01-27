import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ParentNavbar from "../../components/ParentNavbar";

// Registering necessary chart components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const studentData = [
    { subject: "Math", avgMarks: 80 },
    { subject: "Science", avgMarks: 85 },
    { subject: "English", avgMarks: 82 },
    { subject: "History", avgMarks: 68 },
    { subject: "Art", avgMarks: 86 },
    { subject: "Sinhala", avgMarks: 51 },
    { subject: "Environment", avgMarks: 90 },
    { subject: "Geography", avgMarks: 88 },
    { subject: "Civics", avgMarks: 80 },
    { subject: "Tamil", avgMarks: 88 },
    { subject: "Dancing", avgMarks: 88 },
    { subject: "Buddhism", avgMarks: 88 },



  ];

  // Data for the bar chart
  const chartData = {
    labels: studentData.map(data => data.subject),
    datasets: [
      {
        label: "Last Month",
        data: [75, 80, 70, 60, 85], // Example data for Girls
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "This Month",
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
        text: "Performance",
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
      <ParentNavbar/>

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

        <div className="grid grid-cols-3 gap-6">
          {/* Table Section */}
          <div className="col-span-1 bg-gray-200 mt-4 mx-4 p-4 rounded-md h-96 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Subject Marks</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Subject</th>
                  <th className="text-left py-2">Marks</th>
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
            <h2 className="text-lg font-bold mb-4">Performance</h2>
            <div className="h-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Average and Comment Section */}
        <div className="mt-6 grid grid-cols-3 gap-6 mx-4">
          <div className="col-span-1 bg-gray-200 p-4 rounded-md">
            <h2 className="text-lg font-bold">Average</h2>
            <div className="h-24 bg-white mt-4"></div>
          </div>

          <div className="col-span-2 bg-gray-200 p-4 rounded-md">
            <h2 className="text-lg font-bold">Comment Section</h2>
            <div className="h-24 bg-white mt-4"></div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
