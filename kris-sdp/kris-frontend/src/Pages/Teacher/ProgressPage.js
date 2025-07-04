import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProgressPage = () => {
  const { studentId: paramStudentId } = useParams();
  const [studentId, setStudentId] = useState(paramStudentId || "");
  const [progress, setProgress] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);

  const calculateAverage = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, item) => sum + Number(item.Marks), 0);
    return (total / progress.length).toFixed(2);
  };
  

  // 1. If no paramStudentId, get studentId from token
  useEffect(() => {
    if (!paramStudentId) {
      axios
        .get("http://localhost:5001/api/progress/me", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
           const id = res.data.studentId;
           console.log(id);
          setStudentId(id);
  
          // Fetch progress after studentId is known
          fetch(`http://localhost:5001/api/progress/${id}`)
            .then((res) => res.json())
            .then((data) => setProgress(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching progress:", err));
  
          // Fetch comments after studentId is known
          fetch(`http://localhost:5001/api/progress/comment/${id}`)
            .then((res) => res.json())
            .then((data) => setComments(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching comments:", err));
        })
        .catch((err) => {
          console.error("Auth error:", err);
          alert("Authentication failed. Please log in again.");
        });
    }
  }, [paramStudentId]);
  
  

  // 2. Load progress data
  useEffect(() => {
    if (!paramStudentId || !studentId) return;
    fetch(`http://localhost:5001/api/progress/${studentId}`)
      .then((res) => res.json())
      .then((data) => setProgress(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching progress:", err));
  }, [studentId, paramStudentId]);
  

  // 3. Load comments
  useEffect(() => {
    if (!paramStudentId || !studentId) return;
    fetch(`http://localhost:5001/api/progress/comment/${studentId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [studentId, paramStudentId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    fetch("http://localhost:5001/api/progress/comment/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, comment: newComment }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch(`http://localhost:5001/api/progress/comment/${studentId}`)
          .then((res) => res.json())
          .then((data) => setComments(Array.isArray(data) ? data : []));
        setNewComment("");
      })
      .catch((err) => console.error("Error adding comment:", err));
  };

  return (
        <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Comments about Student and the Progress</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Progress Section */}
        <div className="md:w-2/3">
          {progress.length > 0 ? (
            <div className="space-y-4">
            <div className="bg-blue-100 text-blue-800 p-3 rounded-md mb-4">
        <strong>Average Marks:</strong> {calculateAverage()}
      </div>
              {progress.map((item, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-md border">
                  <p className="text-lg font-medium text-gray-700">
                    <strong>Subject:</strong> {item.Subject_name}
                  </p>
                  <p className="text-gray-600"><strong>Marks:</strong> {item.Marks}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500"></p>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-10 bg-white p-6 shadow-md rounded-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>

          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="border p-2 rounded-md bg-gray-50">
                  <p className="text-gray-700">{comment.Comment}</p>
                  <p className="text-sm text-gray-500">
                    on {new Date(comment.Created_At).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProgressPage;
