import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/NavbarTeacher';
import SearchIcon from "@mui/icons-material/Search";

const StudyMaterials = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen">

        {/* Main Content */}
        <div className="flex-1 bg-blue-900">
          {/* Header */}
          <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
            <h1 className="text-2xl font-bold">Study Materials</h1>

          </header>


          {/* Study Material Cards */}
          <div className="grid grid-cols-2 gap-6 px-8 py-4">
            {/* Music Card */}
            <div
              className="bg-gray-200 rounded-md p-4 flex flex-col items-center h-64 shadow-md cursor-pointer hover:bg-gray-300"
              onClick={() => navigate("/study-materials/music")}
            >
              <span className="text-9xl mb-4">🎵</span>
              <h2 className="text-xl font-bold">Music</h2>
            </div>

            {/* Reading Card */}
            <div
              className="bg-gray-200 rounded-md p-4 flex flex-col items-center h-64 shadow-md cursor-pointer hover:bg-gray-300"
              onClick={() => navigate("/study-materials/reading")}
            >
              <span className="text-9xl mb-4">📚</span>
              <h2 className="text-xl font-bold">Reading</h2>
            </div>

            {/* Videos Card */}
            <div
              className="bg-gray-200 rounded-md p-4 flex flex-col items-center h-64 shadow-md cursor-pointer hover:bg-gray-300"
              onClick={() => navigate("/study-materials/videos")}
            >
              <span className="text-9xl mb-4">🎥</span>
              <h2 className="text-xl font-bold">Videos</h2>
            </div>

            {/* General Knowledge Card */}
            <div
              className="bg-gray-200 rounded-md p-4 flex flex-col items-center h-64 shadow-md cursor-pointer hover:bg-gray-300"
              onClick={() => navigate("/study-materials/general-knowledge")}
            >
              <span className="text-9xl mb-4">🌍</span>
              <h2 className="text-xl font-bold">General Knowledge</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
