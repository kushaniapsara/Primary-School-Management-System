import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import ParentNavbar from '../../components/ParentNavbar';

import axios from 'axios'; // Make sure axios is installed for making HTTP requests

const App = () => {

  const [activities, setActivities] = useState([]);
  const [enrolledActivities, setEnrolledActivities] = useState(new Set()); // Track enrolled activities


  let token = localStorage.getItem("token");


  // Fetch activities from backend 
  useEffect(() => {
    fetch("http://localhost:5001/api/activities") 
      .then((response) => response.json())
      .then((data) => {
        setActivities(data); // Assuming data is an array of activities
      })
      .catch((error) => console.error("Error fetching activities:", error));
}, []);


// Fetch enrolled activities when the component mounts
useEffect(() => {
  if (!token) return;

  fetch("http://localhost:5001/api/enrolled-activities", {
    headers: { Authorization: token },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setEnrolledActivities(new Set(data.activities.map(activity => activity.Activity_ID))); // Convert to Set
      }
    })
    .catch((error) => console.error("Error fetching enrolled activities:", error));
}, [token]);



  
  const handleEnroll = (activityID) => {
    let token = localStorage.getItem("token");
  
    if (!token) {
      alert("You need to log in first");
      return;
    }
  
    // Remove "Bearer " if it already exists
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract only the token part
    }
  
    fetch("http://localhost:5001/api/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Send only the correct token
      },
      body: JSON.stringify({ activityID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Enrollment successful!");
        // ✅ Create a new Set and update the state
        setEnrolledActivities((prevSet) => {
          const updatedSet = new Set(prevSet);
          updatedSet.add(activityID); // Add newly enrolled activity
          return updatedSet; // Return new Set to trigger re-render
        });
        } else {
          alert(data.message);

        }
      })
      .catch((error) => console.error("Enrollment error:", error));
  };
  

  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Extra Curricular Activities</h2>
          <div className="text-right">
            <p className="text-sm">Student_001</p>
            <p className="font-semibold">Kushani Apsara</p>
          </div>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {[
            { "Activity_ID": 1, "name": "Chess", "img": "♟️" },
            { "Activity_ID": 2, "name": "Dancing", "img": "💃" },
            { "Activity_ID": 3, "name": "Band", "img": "🎷" },
            { "Activity_ID": 4, "name": "Elocution", "img": "🗣️" },
            { "Activity_ID": 5, "name": "Swimming", "img": "🏊‍♀️" },
            { "Activity_ID": 13, "name": "Table Tennis", "img": "🏓" },

            
          ].map((activity, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-lg shadow hover:shadow-lg hover:bg-green-700 transition duration-300"
            >
              <div className="flex justify-center mb-4">
                <Avatar
                  sx={{
                    width: 150,
                    height: 150,
                    fontSize: "5rem",
                    opacity: ["Chess", "Dancing"].includes(activity.name) ? 1 : 0.5, // Full opacity for Chess and Dancing
                  }}
                  className="bg-blue-100"
                >
                  {activity.img}
                </Avatar>
              </div>
              <h3 className="text-center font-semibold text-lg mb-4">
                {activity.name}
              </h3>
              {/* Hide Enroll Button if already enrolled */}
              {!enrolledActivities.has(activity.Activity_ID) && (
                <button
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                  onClick={() => handleEnroll(activity.Activity_ID)}
                >
                  Enroll
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
