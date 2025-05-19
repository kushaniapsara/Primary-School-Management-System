import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MusicPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [materials, setMaterials] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null); // For modal

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/upload/music`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        fetchMaterials(); // refresh the list
        setFile(null);
        setTitle("");
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
      const response = await fetch("http://localhost:5001/api/study-materials/music");
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

  //to hide buttons
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

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen">
        <div className="flex-1 bg-blue-900 p-8 text-black">
          <h1 className="text-2xl font-bold mb-6 text-white">Music Materials</h1>

          {userRole === "Teacher" && (
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
              <input type="file" onChange={handleFileChange} className="border p-2 rounded w-1/4" />
              <input
                type="text"
                placeholder="Caption"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded w-1/4"
              />
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
                Upload
              </button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-4 gap-6">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div
                  key={material.Material_ID}
                  onClick={() => setSelectedMaterial(material)}
                  className="cursor-pointer bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl"
                >
                  {material.File_Path.endsWith(".jpg") ||
                    material.File_Path.endsWith(".jpeg") ||
                    material.File_Path.endsWith(".png") ? (
                    <img
                      src={`http://localhost:5001/${material.File_Path}`}
                      alt={material.Title}
                      className="w-32 h-32 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-lg mb-2">
                      Music
                    </div>
                  )}
                  <p className="text-black font-semibold">{material.Title}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-white col-span-4">No materials found.</p>
            )}
          </div>

          {/* Modal */}
          {selectedMaterial && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg relative max-w-lg w-full">
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="absolute top-3 right-4 text-4xl font-extrabold text-red-600 hover:text-white hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition duration-300"
                >
                  ×
                </button>

                <h2 className="text-lg font-bold mb-4">{selectedMaterial.Title}</h2>

                {selectedMaterial.File_Path.endsWith(".mp3") ||
                  selectedMaterial.File_Path.endsWith(".wav") ||
                  selectedMaterial.File_Path.endsWith(".ogg") ? (
                  <audio controls className="w-full">
                    <source src={`http://localhost:5001/${selectedMaterial.File_Path}`} />
                    Your browser does not support the audio element.
                  </audio>
                ) : selectedMaterial.File_Path.endsWith(".mp4") ? (
                  <video controls className="w-full max-h-96">
                    <source src={`http://localhost:5001/${selectedMaterial.File_Path}`} />
                    Your browser does not support the video element.
                  </video>
                ) : selectedMaterial.File_Path.endsWith(".jpg") ||
                  selectedMaterial.File_Path.endsWith(".jpeg") ||
                  selectedMaterial.File_Path.endsWith(".png") ? (
                  <img
                    src={`http://localhost:5001/${selectedMaterial.File_Path}`}
                    alt={selectedMaterial.Title}
                    className="w-full rounded"
                  />
                ) : (
                  <p>Preview not supported for this file type.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
