import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/NavbarTeacher';
import SearchIcon from "@mui/icons-material/Search";

const StudyMaterials = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Study Materials</h1>
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
        </header>

        {/* Search */}
        <div className="px-8 py-4">
          <button className="flex items-center bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
            <SearchIcon className="mr-2" />
            Search
          </button>
        </div>

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
  );
};

export default StudyMaterials;
