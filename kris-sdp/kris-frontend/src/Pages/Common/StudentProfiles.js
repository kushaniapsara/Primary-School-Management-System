import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you stored the JWT here after login

        const response = await fetch("http://localhost:5001/api/students/by-class", {
          headers: {
            Authorization: token, // 👈 send token in header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);


  return (

    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Student Profiles</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student.Student_ID} className="p-4 border rounded-md shadow-md flex flex-col items-center">
              <img
                src={`http://localhost:5001/${student.Profile_photo}`}
                alt={student.Full_name}
                className="w-24 h-24 object-cover rounded-full"
              />
              <h2 className="text-lg font-semibold text-center mt-2">{student.Full_name}</h2>
              <p className="text-sm text-center">Syllabus: {student.Syllabus}</p>
              <p className="text-sm text-center">Contact: {student.Contact_number}</p>

              {/* Buttons for navigating to Progress and Extra Curricular pages */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/progress/${student.Student_ID}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Comments
                </button>
                <button
                  onClick={() => navigate(`/extra-curricular/${student.Student_ID}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Extra Curricular
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfiles;
