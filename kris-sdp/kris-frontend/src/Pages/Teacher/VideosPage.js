import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavbarTeacher";

const VideosPage = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/study-materials/videos")
            .then((response) => response.json())
            .then((data) => setFile(data))
            .catch((error) => console.error("Error fetching files:", error));
    }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/study-materials/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(null); // Clear file input
        fetchUploadedFiles(); // Refresh uploaded files list
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file.");
    }
  };

  // Fetch uploaded videos
  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch("/api/study-materials/videos");
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.materials);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };

  // Fetch uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="flex h-screen">
      <Navbar />

      <div className="flex-1 bg-blue-900">
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Upload Video</h1>
        </header>

        <div className="px-8 py-4">
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>

        <div className="px-8 py-4">
          <h2 className="text-xl font-semibold text-white">Uploaded Videos</h2>
          <ul className="mt-2">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <li key={index} className="text-white">
                  {file}
                </li>
              ))
            ) : (
              <p className="text-white">No videos uploaded yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
