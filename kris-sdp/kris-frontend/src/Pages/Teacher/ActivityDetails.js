import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const ActivityDetails = () => {
  const { id } = useParams(); // Get activity id from URL params
  const [activity, setActivity] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images

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

  // Handle multiple image uploads
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file), // Temporary URL for preview
      src: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image from state
  const handleRemoveImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  if (!activity)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
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
            📜 {activity.description || "No description available."}
          </p>
          <p className="text-gray-600 text-lg mt-4">
            👥 Active Students: {activity.active_students || "N/A"}
          </p>
          <p className="text-gray-600 text-lg">
            👨‍🏫 Teacher-in-Charge: {activity.teacher_in_charge || "N/A"}
          </p>
          <p className="text-gray-600 text-lg">📍 Location: {activity.location || "N/A"}</p>
        </div>

        {/* Right: Achievements Section */}
        <div className="w-2/3 bg-white shadow-lg rounded-xl p-6 min-h-[500px] flex flex-col">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Achievements
          </Typography>
          {/* Upload Button */}
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-fit mb-4">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Scrollable Grid for Images */}
          <div className="grid grid-cols-3 gap-6 mt-4 overflow-y-auto max-h-[600px]">
            {loadingImages ? (
              <div className="col-span-3 flex justify-center">
                <CircularProgress />
              </div>
            ) : Array.isArray(images) && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.src}
                    alt="Activity Achievement"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <IconButton
                    size="small"
                    className="absolute top-2 right-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <Delete fontSize="small" className="text-red-500" />
                  </IconButton>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center">No images available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
