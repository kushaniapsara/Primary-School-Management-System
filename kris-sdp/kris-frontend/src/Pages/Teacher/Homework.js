import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";


import Navbar from "../../components/NavbarTeacher";

const Homework = () => {
  const [homeworkList, setHomeworkList] = useState([]); // State for homework
  const [showModal, setShowModal] = useState(false); // Modal visibility (for add/edit)
  const [editingHomework, setEditingHomework] = useState(null); // Track homework being edited
  const [homeworkData, setHomeworkData] = useState({
    Homework_task: "",
    Due_date: "",
  });

const [userRole, setUserRole] = useState(""); // NEW state to track user role



  

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


  // Fetch homework
  const fetchHomework = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token from storage
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      const response = await axios.get("http://localhost:5001/api/homework", {
        headers: { Authorization: token }, // Send token for authentication
      });
  
      setHomeworkList(response.data);
    } catch (error) {
      console.error("Error fetching homework data!", error);
    }
  };
  

  useEffect(() => {
    fetchHomework();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHomeworkData({ ...homeworkData, [name]: value });
  };

  // Add or update homework
  const handleSaveHomework = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const { Homework_task, Due_date } = homeworkData;
  
      if (editingHomework) {
        // Update existing homework
        await axios.put(
          `http://localhost:5001/api/homework/${editingHomework.Homework_ID}`,
          { Homework_task, Due_date },
          { headers: { Authorization: token } }
        );
  
        setHomeworkList(
          homeworkList.map((hw) =>
            hw.Homework_ID === editingHomework.Homework_ID
              ? { ...hw, Homework_task, Due_date }
              : hw
          )
        );
      } else {
        // Add new homework
        const response = await axios.post(
          "http://localhost:5001/api/homework",
          { Homework_task, Due_date },
          { headers: { Authorization: token } }
        );
        setHomeworkList([...homeworkList, response.data]);
      }
  
      setShowModal(false);
      setEditingHomework(null);
      setHomeworkData({ Homework_task: "", Due_date: "" }); // Removed Class_ID
    } catch (error) {
      console.error("Error saving homework!", error);
      alert("Failed to save homework. Please try again.");
    }
  };
  

  // Open modal for adding/editing
  const openModal = (homework = null) => {
    if (homework) {
      setEditingHomework(homework);
      setHomeworkData({
        Homework_task: homework.Homework_task,
        Due_date: homework.Due_date.split("T")[0], // Format date properly
      });
    } else {
      setEditingHomework(null);
      setHomeworkData({ Homework_task: "", Due_date: "" });
    }
    setShowModal(true);
  };

  // Handle deleting homework
  const handleDeleteHomework = async (id) => {
    if (!window.confirm("Are you sure you want to delete this homework?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/homework/${id}`);
      setHomeworkList(homeworkList.filter((hw) => hw.Homework_ID !== id)); // Update UI after delete
    } catch (error) {
      console.error("Error saving homework!", error);
      if (error.response) {
        console.log("Backend Error:", error.response.data);
      }
      alert("Failed to save homework. Please try again.");
    }
    
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200">
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Homework</h1>
          
        </header>

        <div className="flex justify-between items-center px-8 py-4">
          {/* <div className="flex space-x-4">
            <button className="flex items-center bg-white px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
              <SearchIcon className="mr-2" />
              Search
            </button>
            <button className="flex items-center bg-white px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
              <FilterListIcon className="mr-2" />
              Filter
            </button>
          </div> */}
          {userRole === "Teacher" && ( 

          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => openModal()}
          >
            <AddIcon className="mr-2" />
            Add Activity
          </button>
        )} 
        </div>

        <div className="px-8">
          {/* Upcoming Homework Section */}
          <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Homework</h2>
            <div className="rounded-md h-60 overflow-auto p-2 space-y-4">
              {homeworkList
                .filter((hw) => new Date(hw.Due_date) > new Date())
                .map((homework) => (
                  <div key={homework.Homework_ID} className="flex justify-between items-center bg-gray-100 text-black p-4 rounded-md">
                    <div>
                      <p className="font-bold">Activity: {homework.Homework_task}</p>
                      <p>Due on {new Date(homework.Due_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => openModal(homework)}>
                        <EditIcon />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteHomework(homework.Homework_ID)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="bg-blue-900 text-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
            <div className="rounded-md h-60 overflow-auto p-2 space-y-4">
              {homeworkList
                .filter((homework) => new Date(homework.Due_date) <= new Date())
                .map((homework) => (
                  <div key={homework.Homework_ID} className="flex justify-between items-center bg-gray-100 text-black p-4 rounded-md">
                    <div>
                      <p className="font-bold">Activity: {homework.Homework_task}</p>
                      <p>Due on {new Date(homework.Due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Modal for Adding/Editing Homework */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-xl font-bold mb-4">{editingHomework ? "Edit Homework" : "Add New Homework"}</h2>
              <input
                type="text"
                name="Homework_task"
                placeholder="Homework Task"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={homeworkData.Homework_task}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="Due_date"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={homeworkData.Due_date}
                onChange={handleInputChange}
              />
              
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSaveHomework}>
                  {editingHomework ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homework;