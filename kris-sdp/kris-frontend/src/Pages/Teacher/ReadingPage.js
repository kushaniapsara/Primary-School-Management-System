import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ReadingPage = () => {
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
      const response = await fetch(`http://localhost:5001/api/study-materials/upload/reading`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        navigate("/study-materials/reading");
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
      const response = await fetch("http://localhost:5001/api/study-materials/reading");
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

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-blue-900 p-8 text-black overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Reading Materials</h1>

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
                onClick={() => setSelectedMaterial(material)}
                className="cursor-pointer bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl"
              >
                {material.File_Path.match(/\.(jpg|jpeg|png)$/i) ? (
                  <img src={`http://localhost:5001/${material.File_Path}`} alt={material.Title} className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-lg mb-2">
                    PDF
                  </div>
                )}
                <p className="text-black font-semibold">{material.Title}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-white col-span-4">No materials found.</p>
          )}
        </div>

        {/* Modal Popup */}
        {selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded-lg w-11/12 max-w-4xl h-5/6 overflow-auto">
              <button
                onClick={() => setSelectedMaterial(null)}
              className="absolute top-3 right-4 text-4xl font-extrabold text-red-600 hover:text-white hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition duration-300"
              >
                &times;
              </button>
              {selectedMaterial.File_Path.match(/\.(jpg|jpeg|png)$/i) ? (
                <img
                  src={`http://localhost:5001/${selectedMaterial.File_Path}`}
                  alt={selectedMaterial.Title}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <iframe
                  src={`http://localhost:5001/${selectedMaterial.File_Path}`}
                  title={selectedMaterial.Title}
                  className="w-full h-[90%] border-none"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPage;
