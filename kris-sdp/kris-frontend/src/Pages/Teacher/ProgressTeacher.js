import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgressTeacher = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [message, setMessage] = useState("");

  const years = Array.from({ length: 9 }, (_, i) => 2022 + i);
  const navigate = useNavigate();

  const fetchStudents = async (selectedYear) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/progress/students/details",
        {
          params: { year: selectedYear },
          headers: { Authorization: token },
        }
      );
      setStudents(response.data);
    } catch (error) {
      setStudents([]);
      setMessage(
        "Error fetching students: " +
          (error.response?.data?.message || error.message)
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents(year);
  }, [year]);

  const handleToggleRow = (studentId) => {
    setOpenRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleViewStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/students");
      if (response.status === 200) {
        localStorage.setItem("students", JSON.stringify(response.data));
        navigate("/StudentProfiles");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error fetching student profiles"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br from-indigo-100 to-teal-50 min-h-screen rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-start mb-6 gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow font-semibold"
          onClick={() => navigate("/addsubmarks")}
        >
          + Add Subject Marks
        </button>
        <h2 className="text-2xl font-bold text-black">
           Progress Overview
        </h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <div>
            <label htmlFor="year" className="block font-medium mb-1">
              Academic Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 w-48"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            className="border border-blue-500 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50"
            onClick={handleViewStudents}
          >
            👤 View Student Profiles
          </button>
        </div>

        {message && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Full Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-4">
                    <div className="text-blue-600 font-medium">Loading...</div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No students found for this year.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <React.Fragment key={student.Student_ID}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2 border text-center">
                        <button
                          onClick={() =>
                            handleToggleRow(student.Student_ID)
                          }
                          className="text-blue-500 font-bold"
                        >
                          {openRows[student.Student_ID] ? "▲" : "▼"}
                        </button>
                      </td>
                      <td className="p-2 border font-semibold text-blue-700">
                        {student.Student_ID}
                      </td>
                      <td className="p-2 border font-medium">
                        {student.Full_name}
                      </td>
                    </tr>
                    {openRows[student.Student_ID] && (
                      <tr>
                        <td colSpan="3" className="p-2 bg-gray-50 border">
                          <div className="mb-2 text-blue-700 font-semibold">
                            📚 Subjects & Marks
                          </div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b bg-gray-200">
                                <th className="p-1">Subject</th>
                                <th className="p-1">Marks</th>
                                <th className="p-1">Term</th>
                                <th className="p-1">Date</th>
                                <th className="p-1">Year</th>
                              </tr>
                            </thead>
                            <tbody>
                              {student.subjects?.length > 0 ? (
                                student.subjects.map((subj, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="p-1">{subj.Subject_name}</td>
                                    <td className="p-1">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          subj.Marks >= 75
                                            ? "bg-green-100 text-green-700"
                                            : subj.Marks >= 50
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {subj.Marks}
                                      </span>
                                    </td>
                                    <td className="p-1">{subj.Term}</td>
                                    <td className="p-1">
                                      {subj.Date
                                        ? new Date(subj.Date).toLocaleDateString()
                                        : "-"}
                                    </td>
                                    <td className="p-1">{subj.year}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="5"
                                    className="text-center text-gray-500 p-2"
                                  >
                                    No subjects found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressTeacher;
