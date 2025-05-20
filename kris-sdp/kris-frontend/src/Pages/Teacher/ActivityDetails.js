import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";


const ActivityDetails = () => {
  const { id } = useParams(); // Get activity id from URL params
  const [activity, setActivity] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images
  // useState for caption
  const [caption, setCaption] = useState("");
  const [userRole, setUserRole] = useState(""); // NEW state to track user role

  const [enrolledStudents, setEnrolledStudents] = useState([]); //for enrolled students
  const [loadingStudents, setLoadingStudents] = useState(true);



  // Fetch activity details based on the id
  useEffect(() => {
    fetch(`http://localhost:5001/api/activities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Activity Data:", data); // Debug log
        setActivity(data);
      })
      .catch((err) => console.error("Error fetching activity details:", err));
  }, [id]);

  // Fetch images for the activity
  useEffect(() => {
    fetch(`http://localhost:5001/api/activities/${id}/images`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          setImages([]); // Handle if data isn't an array
        }
        setLoadingImages(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setImages([]); // Fallback in case of error
        setLoadingImages(false); // Set loading to false on error
      });
  }, [id]);

  // Fetch enrolled students
  useEffect(() => {
    fetch(`http://localhost:5001/api/activities/${id}/students`)
      .then((res) => res.json())
      .then((data) => {
        setEnrolledStudents(data);
        setLoadingStudents(false);
      })
      .catch((err) => {
        console.error("Error fetching enrolled students:", err);
        setEnrolledStudents([]);
        setLoadingStudents(false);
      });
  }, [id]);


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


  // Handle multiple image uploads
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("activityId", id); // Activity ID
    formData.append("image", files[0]); // File
    formData.append("caption", prompt("Enter a caption for the image:")); // Simple prompt for now

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };


  if (!activity)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  const handleDeleteImage = (imageId) => {
    fetch(`http://localhost:5001/api/images/${imageId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log the response message
        // If successful, update the state by filtering out the deleted image
        setImages((prevImages) => prevImages.filter((image) => image.Image_ID !== imageId));
      })
      .catch((err) => {
        console.error('Error deleting image:', err);
      });
  };



  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-blue-900 p-6">

      <div className="flex flex-col items-center min-h-screen bg-blue-900 p-8">
        {/* Two-Column Layout with Activity Name and Emoji in Left Card */}
        <div className="flex w-full max-w-6xl gap-8">
          {/* Left: Activity Details */}
          <div className="w-1/3 bg-white shadow-lg rounded-xl p-6 min-h-[500px] flex flex-col justify-start">
            {/* Activity Name and Emoji */}
            <div className="text-center mb-6">
              <Typography variant="h4" className="font-bold text-gray-900">
                {activity.name || "Activity Name"}
              </Typography>
              <div className="text-8xl">{activity.img || "❓"}</div>
            </div>

            {/* Activity Details */}
            <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
              Activity Details
            </Typography>
            <p className="text-gray-600 text-lg">
              📜 {activity.Description || "No description available."}
            </p>
            <p className="text-gray-600 text-lg mt-4">
              {/* 👥 Active Students: {activity.active_students || "N/A"} */}
            </p>
            <p className="text-gray-600 text-lg">
              👨‍🏫 Teacher-in-Charge: {activity.Teacher_incharge || "N/A"}
            </p>
            <p className="text-gray-600 text-lg">📍 Location: {activity.Location || "N/A"}</p>

            {/* Enrolled Students Card */}
            {userRole === "Admin" && (
            <div className="bg-blue-200 rounded-xl p-6 shadow-md mt-6">
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                ⛹️‍♂️ Enrolled Students
              </Typography>

              {loadingStudents ? (
                <p className="text-gray-500">Loading students...</p>
              ) : enrolledStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {enrolledStudents.map((student) => (
                    <div
                      key={student.Student_ID}
                      className="bg-white rounded-lg shadow p-4 border border-gray-200"
                    >
                      <p className="text-sm text-gray-700 font-semibold">
                        ID: <span className="font-normal">{student.Student_ID}</span>
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">
                        Name: <span className="font-normal">{student.Full_Name}</span>
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">
                        Contact: <span className="font-normal">{student.Contact_number || "N/A"}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No students enrolled yet.</p>
              )}
            </div>)}




          </div>




          {/* Right: Achievements Section */}
          <div className="w-2/3 bg-white shadow-lg rounded-xl p-6 min-h-[500px] flex flex-col">
            <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
              Achievements of Students
            </Typography>
            {/* Upload Button */}
            {/* Upload Images + Caption */}
            <div className="flex flex-col gap-2 mb-4"></div>

            {userRole === "Admin" && (

              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-fit mb-4">
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>)}



            {/* Scrollable Grid for Images */}
            <div className="grid grid-cols-3 gap-6 mt-4 overflow-y-auto max-h-[600px]">
              {loadingImages ? (
                <div className="col-span-3 flex justify-center">
                  <CircularProgress />
                </div>
              ) : Array.isArray(images) && images.length > 0 ? (
                images.map((image) => (
                  <div key={image.Image_ID} className="relative group">
                    <img src={`http://localhost:5001${image.Image_Path}`} alt="Activity" />

                    {image.Caption && (
                      <p className="text-center mt-2 text-gray-600 text-base">{image.Caption}</p>
                    )}


                    {userRole === "Admin" && (

                      <IconButton
                        size="small"
                        className="absolute top-2 right-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImage(image.Image_ID)}
                      >
                        <Delete fontSize="small" className="text-red-500" />
                      </IconButton>)}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center">No images available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
