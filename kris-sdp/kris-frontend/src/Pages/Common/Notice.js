import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

//import Navbar from "../../components/NavbarTeacher";

const Notice = () => {
  const [noticeList, setNoticeList] = useState([]); // State for notices
  const [showModal, setShowModal] = useState(false); // Modal visibility (for add/edit)
  const [editingNotice, setEditingNotice] = useState(null); // Track notice being edited
  const [noticeData, setNoticeData] = useState({
    Heading: "",
    Date: "",
    Description: "",
    Admin_ID: "",
  });

  // Fetch notices
  const fetchNotice = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/notice");
      setNoticeList(response.data);
    } catch (error) {
      console.error("Error fetching notice data!", error);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoticeData({ ...noticeData, [name]: value });
  };

  // Add or update notice
  const handleSaveNotice = async () => {
    try {
      if (editingNotice) {
        // Update existing notice
        await axios.put(`http://localhost:5001/api/notice/${editingNotice.Notice_ID}`, noticeData);
        setNoticeList(
          noticeList.map((nt) => (nt.Notice_ID === editingNotice.Notice_ID ? { ...nt, ...noticeData } : nt))
        );
      } else {
        // Add new notice
        const response = await axios.post("http://localhost:5001/api/notice", noticeData);
        setNoticeList([...noticeList, response.data]);
      }

      setShowModal(false);
      setEditingNotice(null);
      setNoticeData({ Heading: "", Date: "", Description: "", Admin_ID: "" });
    } catch (error) {
      console.error("Error saving notice!", error);
      alert("Failed to save notice. Please try again.");
    }
  };

  // Open modal for adding/editing
  const openModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setNoticeData({
        Heading: notice.Heading,
        Date: notice.Date.split("T")[0], // Format date properly
        Description: notice.Description,
        Admin_ID: notice.Admin_ID,
      });
    } else {
      setEditingNotice(null);
      setNoticeData({ Heading: "", Date: "", Description: "", Admin_ID: "" });
    }
    setShowModal(true);
  };

  // Handle deleting notice
  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/notice/${id}`);
      setNoticeList(noticeList.filter((nt) => nt.Notice_ID !== id)); // Update UI after delete
    } catch (error) {
      console.error("Error deleting notice!", error);
      alert("Failed to delete notice. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200">
       

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
            onClick={() => openModal()}
          >
            <AddIcon className="mr-2" />
            Add Notice
          </button>
        </div>

        <div className="px-8">
          {/* Notice Section */}
          <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
            <h2 className="text-xl font-bold mb-4"> Special Notices</h2>
            <div className="space-y-4">
              {noticeList.length > 0 ? (
                noticeList.map((notice) => (
                  <div
                    key={notice.Notice_ID}
                    className="flex justify-between items-center bg-gray-100 text-black p-4 rounded-md"
                  >
                    <div>
                      <p className="font-bold">{notice.Heading}</p>
                      <p>{notice.Description}</p>
                      <p>Date: {new Date(notice.Date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => openModal(notice)}>
                        <EditIcon />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteNotice(notice.Notice_ID)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No notices available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Adding/Editing Notice */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-xl font-bold mb-4">{editingNotice ? "Edit Notice" : "Add New Notice"}</h2>
              <input
                type="text"
                name="Heading"
                placeholder="Notice Title"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={noticeData.Heading}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="Date"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={noticeData.Date}
                onChange={handleInputChange}
              />
              <textarea
                name="Description"
                placeholder="Notice Description"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={noticeData.Description}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="Admin_ID"
                placeholder="Admin_ID"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                value={noticeData.Admin_ID}
                onChange={handleInputChange}
              /> 

              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSaveNotice}>
                  {editingNotice ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
