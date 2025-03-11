import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: { Authorization: token },
        });

        setProfile(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      {message && <p className="text-red-500">{message}</p>}
      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Full Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.Role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
