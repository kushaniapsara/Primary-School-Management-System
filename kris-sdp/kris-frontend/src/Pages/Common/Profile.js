import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/NavbarTeacher";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
  
        const response = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: { Authorization: token },
        });
  
        console.log(response.data); // Debugging - Check fetched data
        setProfile(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching profile");
      }
    };
  
    fetchProfile();
  }, []);
  

  return (
    <div className="flex h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 bg-blue-900">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Profile</h1>
          {profile && (
            <div className="text-right">
              <p className="font-medium">{profile.username}</p>
              <p className="text-gray-500">{profile.full_name}</p>
            </div>
          )}
        </header>

        {message && <p className="text-red-500 text-center mt-4">{message}</p>}

        {profile ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="col-span-1 bg-gray-200 p-4 mt-4 mx-4 rounded-md flex flex-col items-center h-96">
            <div className="w-48 h-48 rounded-full mb-4 overflow-hidden">
                <img
                  src={`http://localhost:5001/${profile.Profile_photo}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>              
              <p className="text-lg font-bold">User ID</p>
              <p className="bg-white text-black rounded-md px-4 py-2 mt-2">
                {profile.username}
              </p>
            </div>

            {/* Contact Information */}
            <div className="col-span-2 bg-gray-200 p-6 mt-4 mx-4 rounded-lg flex flex-col items-center justify-center h-96 shadow-lg text-center space-y-4">
            <h1 className="text-4xl font-bold">{profile.Full_name}</h1>
            <p>Email: {profile.Email}</p>
            <p>Role:{profile.role}</p>
              <p>Class:{profile.class || "N/A"}</p>
              <p>Address: {profile.Address}</p>
              <p>Contact: {profile.Contact_number}</p>

            </div>
          </div>
        ) : (
          <p className="text-white text-center mt-4">Loading...</p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <button className="bg-gray-400 text-black px-6 py-3 mx-4 rounded-md text-lg">
            Student Profiles
          </button>
          <button className="bg-gray-400 text-black px-6 py-3 rounded-md text-lg">
            Class Schedule
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg">
            Edit Details
          </button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-md text-lg">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
