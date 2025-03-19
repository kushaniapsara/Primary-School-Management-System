import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProgressPage = () => {
  const { studentId } = useParams();
  const [progress, setProgress] = useState(null);
  const [newProgress, setNewProgress] = useState({ grade: "", attendance: "", subjects: "", remarks: "" });

  useEffect(() => {
    fetch(`http://localhost:5001/api/progress/${studentId}`)
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch((err) => console.error("Error fetching progress:", err));
  }, [studentId]);

  const handleChange = (e) => {
    setNewProgress({ ...newProgress, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, ...newProgress }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Progress added successfully");
        setNewProgress({ grade: "", attendance: "", subjects: "", remarks: "" });
      })
      .catch((err) => console.error("Error adding progress:", err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Progress Details</h1>
      {progress ? (
        <div>
          <p>Grade: {progress.Grade}</p>
          <p>Attendance: {progress.Attendance}%</p>
          <p>Subjects: {progress.Subjects}</p>
          <p>Remarks: {progress.Remarks}</p>
        </div>
      ) : (
        <p>Loading progress data...</p>
      )}

      {/* Add New Progress Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <input type="text" name="grade" placeholder="Grade" value={newProgress.grade} onChange={handleChange} className="block w-full border p-2 mb-2" />
        <input type="text" name="attendance" placeholder="Attendance %" value={newProgress.attendance} onChange={handleChange} className="block w-full border p-2 mb-2" />
        <input type="text" name="subjects" placeholder="Subjects" value={newProgress.subjects} onChange={handleChange} className="block w-full border p-2 mb-2" />
        <textarea name="remarks" placeholder="Remarks" value={newProgress.remarks} onChange={handleChange} className="block w-full border p-2 mb-2"></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Progress</button>
      </form>
    </div>
  );
};

export default ProgressPage;
