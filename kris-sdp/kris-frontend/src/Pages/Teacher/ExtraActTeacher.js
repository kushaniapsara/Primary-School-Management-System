import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import Navbar from "../../components/NavbarTeacher";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ExtraActTeacher = () => {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Control emoji picker visibility
  const [newActivity, setNewActivity] = useState({ name: "", img: "" });

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch activities from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setNewActivity({ ...newActivity, img: emojiObject.emoji });
    setShowEmojiPicker(false); // Hide picker after selection
  };

  // Handle submit
  const handleSubmit = () => {
    if (!newActivity.name || !newActivity.img) {
      alert("Both name and emoji are required!");
      return;
    }

    fetch("http://localhost:5001/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivity),
    })
      .then((res) => res.json())
      .then((data) => {
        setActivities([...activities, { id: data.id, name: newActivity.name, img: newActivity.img }]); // Ensure ID consistency
        setOpen(false); // Close dialog
        setNewActivity({ name: "", img: "" }); // Reset form
      })
      .catch((err) => console.error("Error adding activity:", err));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 bg-blue-900 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Extra Curricular Activities</h2>
          
        </div>

        {/* Add Activity Button */}
        <div className="p-6">
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Add Activity
          </Button>
        </div>

        {/* Activity Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id} // Use correct ID field
                  className="p-6 bg-white border rounded-lg shadow hover:shadow-lg hover:bg-green-900 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/activity/${activity.id}`)} // Use `id`
                >
                  <div className="flex justify-center mb-4">
                    <Avatar sx={{ width: 150, height: 150, fontSize: "5rem" }} className="bg-blue-100">
                      {activity.img}
                    </Avatar>
                  </div>
                  <h3 className="text-center font-semibold text-lg">{activity.name}</h3>
                </div>
              ))
            ) : (
              <p className="text-white text-center">No activities found</p>
            )}
          </div>
        </div>

        {/* Add Activity Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Activity Name"
              name="name"
              value={newActivity.name}
              onChange={handleChange}
            />

            {/* Emoji Picker Button */}
            <div className="flex items-center mt-4">
              <TextField
                fullWidth
                margin="dense"
                label="Emoji"
                name="img"
                value={newActivity.img}
                disabled
              />
              <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} variant="contained">
                😊
              </Button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-4">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ExtraActTeacher;
