import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  "#1976d2", "#ff7043", "#43a047", "#8e24aa", "#fbc02d",
  "#00acc1", "#e53935", "#7e57c2", "#ffa000", "#00897b"
];

const ProgressPage = () => {
  const [marks, setMarks] = useState([]);
  const [comments, setComments] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [labels, setLabels] = useState([]);

  // 1. Get studentId from token
  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/progress/me", {
          headers: { Authorization: token },
        });
        setStudentId(res.data.studentId);
      } catch (e) {
        setStudentId(null);
      }
    };
    fetchStudentId();
  }, []);

  // 2. Load subject marks
  useEffect(() => {
    if (!studentId) return;
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/progress/my-marks", {
          headers: { Authorization: token },
        });
        setMarks(res.data || []);
      } catch (e) {
        setMarks([]);
      }
    };
    fetchMarks();
  }, [studentId]);

  // 3. Prepare chart data
  useEffect(() => {
    const uniqueTerms = Array.from(new Set(marks.map((m) => m.Term))).sort((a, b) => a - b);
    const subjects = {};

    marks.forEach((m) => {
      if (!subjects[m.Subject_ID]) {
        subjects[m.Subject_ID] = {
          label: m.Subject_name,
          data: {},
        };
      }
      subjects[m.Subject_ID].data[m.Term] = m.Marks;
    });

    const datasets = Object.values(subjects).map((subj, idx) => ({
      label: subj.label,
      data: uniqueTerms.map((t) => subj.data[t] ?? null),
      borderColor: COLORS[idx % COLORS.length],
      backgroundColor: COLORS[idx % COLORS.length],
      tension: 0.3,
      spanGaps: true,
    }));

    setLabels(uniqueTerms.map((t) => `Term ${t}`));
    setDatasets(datasets);
  }, [marks]);

  // 4. Load comments
  useEffect(() => {
    if (!studentId) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/progress/comment/${studentId}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setComments([]);
      }
    };
    fetchComments();
  }, [studentId]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)] overflow-y-auto bg-blue-100 p-6">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Subject Progress</h1>

        {/* Marks Table */}
        <div className="bg-white rounded-md shadow-md overflow-x-auto mb-6">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4">Marks</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr>
                  <td className="py-3 px-4" colSpan="4">No marks found.</td>
                </tr>
              ) : (
                marks.map((m, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-3 px-4">{m.Subject_name}</td>
                    <td className="py-3 px-4">{m.Term}</td>
                    <td className="py-3 px-4">{m.Marks}</td>
                    <td className="py-3 px-4">
                      {m.Date ? new Date(m.Date).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Progress Chart (All Subjects)</h2>
        <div className="bg-white rounded-md shadow-md p-4 mb-10">
          <Line
            data={{ labels, datasets }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: { display: false },
              },
              scales: {
                y: { beginAtZero: true, max: 100 },
              },
            }}
          />
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-md shadow-md border mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50">
                  <p className="text-gray-700">{comment.Comment}</p>
                  <p className="text-sm text-gray-500">
                    {comment.Created_At
                      ? "on " + new Date(comment.Created_At).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
