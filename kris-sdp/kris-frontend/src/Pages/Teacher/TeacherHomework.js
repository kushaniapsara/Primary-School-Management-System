import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Navbar from "../../components/NavbarTeacher";

const Homework = () => {
  const [homeworkList, setHomeworkList] = useState([]); // State for homework
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newHomework, setNewHomework] = useState({
    Homework_task: "",
    Due_date: "",
    Class_ID: "", // Add Class_ID here
  }); // New homework state

  // Fetch homework
  const fetchHomework = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/homework");
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
    setNewHomework({ ...newHomework, [name]: value });
  };

  // Add new homework
  const handleAddHomework = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/homework", newHomework);
      setHomeworkList([...homeworkList, response.data]); // Update state with new homework
      setShowModal(false); // Close modal
      setNewHomework({ Homework_task: "", Due_date: "", Class_ID: "" }); // Reset form
    } catch (error) {
      console.error("Error adding homework!", error);
      alert("Failed to add homework. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <Navbar />

      <div className="flex-1 bg-gray-200">
        <header className="flex justify-between items-center bg-white px-8 py-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Homework</h1>
          <div className="text-right">
            <p className="font-medium">Teacher_002</p>
            <p className="text-gray-500">Hansi Perera</p>
          </div>
        </header>

        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex space-x-4">
            <button className="flex items-center bg-white px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
              <SearchIcon className="mr-2" />
              Search
            </button>
            <button className="flex items-center bg-white px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300">
              <FilterListIcon className="mr-2" />
              Filter
            </button>
          </div>
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            <AddIcon className="mr-2" />
            Add Activity
          </button>
        </div>

        <div className="px-8">
          <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Homework</h2>
            <div className="space-y-4">
              {homeworkList.filter(hw => new Date(hw.Due_date) > new Date()).map(homework => (
                <div key={homework.Homework_ID} className="flex justify-between items-center bg-gray-100 text-black p-4 rounded-md">
                  <div>
                    <p className="font-bold">Activity: {homework.Homework_task}</p>
                    <p>Due on {new Date(homework.Due_date).toLocaleDateString()}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <EditIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-900 text-white p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {homeworkList.filter(homework => new Date(homework.Due_date) <= new Date()).map(homework => (
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

        {/* Modal for Adding Homework */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-xl font-bold mb-4">Add New Homework</h2>
              <input
                type="text"
                name="Homework_task"
                placeholder="Homework Task"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={newHomework.Homework_task}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="Due_date"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={newHomework.Due_date}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="Class_ID"
                placeholder="Class ID"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={newHomework.Class_ID}
                onChange={handleInputChange}
              />
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleAddHomework}>
                  Add
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