import React, { useState, useEffect } from "react";
import axios from "axios";
import SchoolIcon from "@mui/icons-material/School";
import SubjectIcon from "@mui/icons-material/LibraryBooks";
import GradeIcon from "@mui/icons-material/Grade";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const AdminAddSubject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admins/getSubjects");
      setSubjects(res.data);
    } catch (err) {
      setMessageType("error");
      setMessage("Failed to load subjects");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      await axios.post("http://localhost:5001/api/admins/addSubject", {
        Subject_name: subjectName,
        Description: description,
        Grade: grade,
      });
      setMessageType("success");
      setMessage("Subject added successfully!");
      setSubjectName("");
      setDescription("");
      setGrade("");
      fetchSubjects();
    } catch (error) {
      setMessageType("error");
      setMessage("Error adding subject");
    }
  };

  return (
        <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 mb-10">
        <div className="flex items-center mb-5">
          <AddCircleIcon className="text-blue-700 mr-2" fontSize="large" />
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Subject</h2>
        </div>
        {message && (
          <div
            className={`flex items-center mb-5 px-4 py-2 rounded-lg font-medium ${
              messageType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircleOutlineIcon className="mr-2" />
            ) : (
              <ErrorOutlineIcon className="mr-2" />
            )}
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Subject Name</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-200">
              <SubjectIcon className="mr-2 text-blue-400" />
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-transparent outline-none"
                required
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
              rows={3}
              placeholder="Optional subject description..."
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Grade</label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-200">
              
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="1,2,3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg py-2 rounded-xl transition-all duration-200 font-bold shadow-lg mt-2 flex items-center justify-center"
          >
            <AddCircleIcon className="mr-2" />
            Add Subject
          </button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <SchoolIcon className="mr-2 text-green-700" />
          <h3 className="text-xl font-semibold text-gray-700">All Subjects</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subj) => (
            <div
              key={subj.Subject_ID}
              className="bg-gray-50 border border-blue-100 rounded-xl p-4 shadow hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-1">
                <SubjectIcon className="mr-2 text-blue-400" />
                <span className="font-semibold text-lg text-gray-800">
                  {subj.Subject_name}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {subj.Grade ? `Grade: ${subj.Grade}` : ""}
                </span>
              </div>
              {subj.Description && (
                <div className="text-gray-600 text-sm mt-1">{subj.Description}</div>
              )}
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-8">
              No subjects added yet.
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminAddSubject;