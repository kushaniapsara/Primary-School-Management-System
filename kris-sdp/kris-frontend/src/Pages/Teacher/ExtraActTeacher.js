import React from "react";
import { Avatar } from "@mui/material";
import Navbar from '../../components/NavbarTeacher';

const App = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      {/* Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Extra Curricular Activities</h2>
          <div className="text-right">
            <p className="text-sm">Teacher_002</p>
            <p className="font-semibold">Hansi Perera</p>
          </div>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {[
            { name: "Chess", img: "♟️" },
            { name: "Dancing", img: "💃" },
            { name: "Band", img: "🎷" },
            { name: "Elocution", img: "🗣️" },
            { name: "Swimming", img: "🏊‍♀️" },
            { name: "Table Tennis", img: "🏓" },
          ].map((activity, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-lg shadow hover:shadow-lg hover:bg-green-700 transition duration-300"
            >
              <div className="flex justify-center mb-4">
                <Avatar sx={{ width: 150, height: 150, fontSize: "5rem" }} className="bg-blue-100">
                  {activity.img}
                </Avatar>
              </div>
              <h3 className="text-center font-semibold text-lg">
                {activity.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
