/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavbarTeacher";

const GeneralKnowledgePage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  //display the uploaded files
  useEffect(() => {
    fetch("http://localhost:5001/api/study_materials/general_knowledge")
        .then((response) => response.json())
        .then((data) => setFile(data))
        .catch((error) => console.error("Error fetching files:", error));
}, []);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5001/api/study_materials/general_knowledge/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        navigate("/study_materials");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="flex h-screen">
      <Navbar />

      <div className="flex-1 bg-blue-900">
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Upload General Knowledge Material</h1>
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
      </div>
    </div>
  );
};

export default GeneralKnowledgePage;
*/