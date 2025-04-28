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

  //for comment section
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


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

  /*const handleChange = (e) => {
    setNewProgress({ ...newProgress, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = subjects.find(
      (subject) => subject.Subject_name === e.target.value
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

  useEffect(() => {
    fetch("http://localhost:5001/api/progress/subjects")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched subjects:", data); // Check if subjects are received
        setSubjects(data);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);*/

  //comment section
  useEffect(() => {
    fetch(`http://localhost:5001/api/progress/comment/${studentId}`)
    .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [studentId]);

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
      // Refresh comments after adding
      fetch(`http://localhost:5001/api/progress/comment/${studentId}`)
        .then((res) => res.json())
        .then((data) => setComments(Array.isArray(data) ? data : []));
      setNewComment("");
    })
    .catch((err) => console.error("Error adding comment:", err));
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
                    <strong>Subject:</strong> {item.Subject_name}
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

        

        {/*comment section*/}
        <div className="mt-10 bg-white p-6 shadow-md rounded-md border">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>

  {/* Display existing comments */}
  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
  {comments.length > 0 ? (
  comments.map((comment, index) => (
    <div key={index} className="border p-2 rounded-md bg-gray-50">
      <p className="text-gray-700">{comment.Comment}</p>
      <p className="text-sm text-gray-500">on {new Date(comment.Created_At).toLocaleDateString()}</p>
    </div>
  ))
    ) : (
      <p className="text-gray-500">No comments yet.</p>
    )}

  </div>

  {/* Add new comment */}
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
  );
};

export default ProgressPage;
