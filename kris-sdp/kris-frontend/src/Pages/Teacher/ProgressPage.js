import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProgressPage = () => {
  const { studentId } = useParams();
  const [progress, setProgress] = useState([]);
  const [newProgress, setNewProgress] = useState({
    marks: "",
    average: "",
    subjectId: "",
    date: "",
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/progress/${studentId}`)
      .then((res) => res.json())
      .then((data) => setProgress(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching progress:", err));

    fetch("http://localhost:5001/api/progress/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [studentId]);

  const handleChange = (e) => {
    setNewProgress({ ...newProgress, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = subjects.find(
      (subject) => subject.Subject_Name === e.target.value
    );
    setNewProgress({
      ...newProgress,
      subjectId: selectedSubject ? selectedSubject.Subject_ID : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { subjectId, date, marks, average } = newProgress;

    if (!subjectId || !date || !marks || !average) {
      alert("Please fill all the fields");
      return;
    }

    fetch("http://localhost:5001/api/progress/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        subjectId,
        date,
        marks,
        average,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Progress added successfully");
        setNewProgress({
          marks: "",
          average: "",
          subjectId: "",
          date: "",
        });
      })
      .catch((err) => console.error("Error adding progress:", err));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Student Progress</h1>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Progress Details - Left Side */}
        <div className="md:w-2/3">
          {progress.length > 0 ? (
            <div className="space-y-4">
              {progress.map((item, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-md border">
                  <p className="text-lg font-medium text-gray-700">
                    <strong>Subject:</strong> {item.Subject_Name}
                  </p>
                  <p className="text-gray-600"><strong>Marks:</strong> {item.Marks}</p>
                  <p className="text-gray-600"><strong>Average:</strong> {item.Average}</p>
                  <p className="text-gray-500"><strong>Date:</strong> {item.Date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No progress data available or still loading...</p>
          )}
        </div>

        {/* Add New Progress - Right Side */}
        <div className="md:w-1/3 bg-white p-6 shadow-lg rounded-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Progress</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              name="date"
              value={newProgress.date}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="marks"
              placeholder="Marks"
              value={newProgress.marks}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              name="average"
              placeholder="Average"
              value={newProgress.average}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />

            {/* Subject Dropdown */}
            <select
              name="subject"
              value={newProgress.subjectId}
              onChange={handleSubjectChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a subject</option>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option key={subject.Subject_ID} value={subject.Subject_Name}>
                    {subject.Subject_Name}
                  </option>
                ))
              ) : (
                <option>No subjects available</option>
              )}
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Progress
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
