import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const VideoPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [materials, setMaterials] = useState([]);
  const [userRole, setUserRole] = useState("");

  const [selectedMaterial, setSelectedMaterial] = useState(null); // For popup

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch("http://localhost:5001/api/study-materials/upload/video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        navigate("/study-materials/videos");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file.");
    }
  };

  // Function to fetch the materials from the backend
  const fetchMaterials = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/study-materials/video");
      const data = await response.json();
      setMaterials(data.materials || []);
    } catch (error) {
      console.error("Error fetching materials", error);
    }
  };

  // Fetch the materials when the component mounts
  useEffect(() => {
    fetchMaterials();
  }, []);

  // to hide buttons
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        setUserRole("");
      }
    }
  }, []);

  // Close popup
  const closePopup = () => {
    setSelectedMaterial(null);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen">
        <div className="flex-1 bg-blue-900 p-8 text-black overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Video Materials</h1>

          {userRole === "Teacher" && (
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
              <input type="file" onChange={handleFileChange} className="border p-2 rounded w-1/4" />
              <input type="text" placeholder="Caption" onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-1/4" />
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-4 gap-6">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div
                  key={material.Material_ID}
                  className="bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material.File_Path.endsWith(".mp4") || material.File_Path.endsWith(".webm") || material.File_Path.endsWith(".mov") ? (
                    <video className="w-48 h-32 rounded-lg mb-2" muted>
                      <source src={`http://localhost:5001/${material.File_Path}`} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-lg mb-2">
                      File
                    </div>
                  )}
                  <p className="text-black font-semibold text-center">{material.Title}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-white col-span-4">No materials found.</p>
            )}
          </div>
        </div>

        {/* === Popup Modal === */}
        {selectedMaterial && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative shadow-xl">
              <button
                onClick={closePopup}
                className="absolute top-3 right-4 text-4xl font-extrabold text-red-600 hover:text-white hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition duration-300"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">{selectedMaterial.Title}</h2>

              <video controls className="w-full h-[500px] rounded-lg">
                <source src={`http://localhost:5001/${selectedMaterial.File_Path}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
