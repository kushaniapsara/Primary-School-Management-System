import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GeneralKnowledgePage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [materials, setMaterials] = useState([]); // State to store the materials
  const [userRole, setUserRole] = useState(""); // NEW state to track user role



  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {


    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);  // Replace with actual value
    // formData.append("description", description); // Replace with actual value
    // formData.append("class_id", classId); // Replace with actual Class_ID


    try {
      const response = await fetch(`http://localhost:5001/api/study-materials/upload/general-knowledge`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        navigate("/study-materials/general-knowledge");
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
      const response = await fetch("http://localhost:5001/api/study-materials/general-knowledge");
      const data = await response.json();
      console.log("Fetched Materials:", data); // Debugging log

      if (data.materials) {
        setMaterials(data.materials); // Ensure you're setting the array, not the entire object
      } else {
        setMaterials([]); // Fallback to empty array if materials key is missing
      }
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
        console.log(decoded.role); // Add this line to check the value

      } catch (error) {
        console.error("Invalid token", error);
        setUserRole(""); // assuming your token has a 'role' field
      }
    }
  }, []);


  return (
    <div className="flex h-screen">

      <div className="flex-1 bg-blue-900 p-8 text-black">
        <h1 className="text-2xl font-bold mb-6 text-white">General Knowledge Materials</h1>

        {userRole === "Teacher" && (
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
            <input type="file" onChange={handleFileChange} className="border p-2 rounded w-1/4" />
            <input type="text" placeholder="Caption" onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded w-1/4" />
            {/* <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded w-1/4" /> */}
            {/* <input type="number" placeholder="Class ID" onChange={(e) => setClassId(e.target.value)} className="border p-2 rounded w-1/6" /> */}
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
          </div>)}

        <div className="mt-8 grid grid-cols-4 gap-6">
          {materials.length > 0 ? (
            materials.map((material) => (
              <a
                key={material.Material_ID}
                href={`http://localhost:5001/${material.File_Path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl"
              >
                {material.File_Path.endsWith(".jpg") || material.File_Path.endsWith(".jpeg") || material.File_Path.endsWith(".png") ? (
                  <img src={`http://localhost:5001/${material.File_Path}`} alt={material.Title}  className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-lg mb-2">
                    PDF
                  </div>
                )}
                <p className="text-black font-semibold">{material.Title}</p>
              </a>
            ))
          ) : (
            <p className="text-center text-white col-span-4">No materials found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralKnowledgePage;