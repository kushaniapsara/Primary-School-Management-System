import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(""); // Extracted from token


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [editLinkModal, setEditLinkModal] = useState(false);
  const [newScheduleLink, setNewScheduleLink] = useState("");
  const [showLocation, setShowLocation] = useState(false);


  const [userRole, setUserRole] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get("http://localhost:5001/api/auth/profile", {
          headers: { Authorization: token },
        });
        console.log("Profile data:", response.data);
        setProfile(response.data);
        // localStorage.setItem("username", response.data.username); 

      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/auth/reset-password",
        { currentPassword, newPassword },
        { headers: { Authorization: token } }
      );
      setPasswordMessage("Password successfully updated.");
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || "Error resetting password");
    }
  };



  const handleOpenSchedule = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/google-link");
      const link = response.data.link;
      if (link) {
        window.open(link, "_blank"); // opens in a new tab
      }
    } catch (error) {
      console.error("Error fetching schedule link:", error);
      setMessage("Failed to load schedule.");
    }
  };


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

  // Helper to extract user ID and label
  const getUserId = (profile) => {
    if (profile.Student_ID) return { label: "Student ID", value: profile.Student_ID };
    if (profile.Teacher_ID) return { label: "Teacher ID", value: profile.Teacher_ID };
    if (profile.Admin_ID) return { label: "Admin ID", value: profile.Admin_ID };
    return { label: "User ID", value: "N/A" };
  };
  const userIdInfo = profile ? getUserId(profile) : { label: "User ID", value: "" };



  return (

    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex min-h-screen">

        <div className="flex-1 bg-blue-900 p-8">
          <header className="flex justify-between items-center bg-white text-black rounded-xl px-6 py-4 shadow-md mb-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            {profile && (
              <div className="text-right">
                {/* <p className="text-lg font-semibold">{profile.username}</p>
              <p className="text-gray-600">{profile.Full_name}</p> */}
              </div>
            )}
          </header>

          {message && <p className="text-red-400 text-center mt-2">{message}</p>}

          {profile ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white text-black rounded-xl shadow-lg p-6 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-blue-300">
                  <img
                    src={`http://localhost:5001/${profile.Profile_photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xl font-semibold">User Name</p>
                <p className="mt-2 px-4 py-2 bg-gray-100 text-black rounded-lg text-center">
                  {profile.username}

                </p>

                <p className="text-xl font-semibold">{userIdInfo.label}</p>
                <p className="mt-2 px-4 py-2 bg-gray-100 text-black rounded-lg text-center">
                  {userIdInfo.value}
                </p>

              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 bg-white text-black rounded-xl shadow-lg p-8 space-y-3">
                <h2 className="text-2xl font-bold text-center">{profile.Full_name}</h2>
                <p className="text-lg">📧 Email: {profile.Email}</p>
                {/* <p className="text-lg">🧑‍🏫 Role: {role}</p> */}
                <p className="text-lg">
                  🏫 Class:{" "}
                  {profile.class_name ? (
                    <span
                      className="text-blue-700 underline cursor-pointer ml-1"
                      title="Show class location"
                      onClick={() => setShowLocation((prev) => !prev)}
                    >
                      {profile.class_name}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </p>
                {showLocation && profile.class_location && (
                  <div className="text-md bg-blue-50 px-4 py-2 rounded-lg shadow inline-block my-2">
                    📍 <span className="font-semibold">Location:</span> {profile.class_location}
                  </div>
                )}
                <p className="text-lg">🏠 Address: {profile.Address}</p>
                <p className="text-lg">📞 Contact: {profile.Contact_number}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-white text-lg mt-6">Loading...</p>
          )}


          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleOpenSchedule}
              className="bg-green-600 hover:bg-green-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              📚 Class Schedule
            </button>


            {/* edit schedule link */}
            {userRole === "Admin" && (
              <button
                onClick={() => setEditLinkModal(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
              >
                ✏️
              </button>
            )}

            {editLinkModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4">Edit Class Schedule Link</h2>
                  <input
                    type="text"
                    placeholder="Enter new schedule link"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
                    value={newScheduleLink}
                    onChange={(e) => setNewScheduleLink(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.put(
                            "http://localhost:5001/api/google-link",
                            { link: newScheduleLink }
                          );
                          setMessage("Schedule link updated.");
                          setEditLinkModal(false);
                        } catch (error) {
                          setMessage(error.response?.data?.error || "Failed to update link.");
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditLinkModal(false)}
                      className="bg-gray-400 text-black px-4 py-2 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              🔐 Change Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              🚪 Logout
            </button>
          </div>

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                {passwordMessage && (
                  <p className="text-red-600 text-center mt-4">{passwordMessage}</p>
                )}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePasswordReset}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="bg-gray-400 px-4 py-2 rounded-md text-black hover:bg-gray-500"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;