import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Navbar from "../../components/AdminNavbar";

import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { FormControl, InputLabel, Select } from '@mui/material';


const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  //const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Added for modal functionality
  
  const [className, setClassName] = useState(""); // Store selected class

  const [filters, setFilters] = useState({
    grade: "",
    className: "",
    name: ""
  });

  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    nameWithInitials: "",
    age: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    enrollmentDate: "",
    documents: "",
    password: "",
    username: "",
    nic: "",
    previousSchools: "",
    status: "",
    leavingDate: "",
    role: "",
    grade: "",
    className: ""


    
  });

  useEffect(() => {
    fetch("http://localhost:5001/api/teachers")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Check if data is received
        setTeachers(data);
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  // Function to handle grade selection and generate class options
const handleGradeChange = (event) => {
  const selectedGrade = event.target.value;
  setNewTeacher({
      ...newTeacher,
      grade: selectedGrade,
      className: `${selectedGrade}A`  // Set default class as "1A" for example
  });
};

// Generate class options based on grade
const generateClassOptions = () => {
  const classes = [];
  const grade = newTeacher.grade;

  if (grade) {
      for (let i = 1; i <= 3; i++) {  // assuming you have 3 classes per grade
          classes.push(`${grade}${String.fromCharCode(64 + i)}`); // 65 -> A, 66 -> B, etc.
      }
  }

  return classes;
};




  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(newTeacher).forEach((key) => {
      formData.append(key, newTeacher[key]);
    });
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    formData.append("academicYear", new Date().getFullYear()); // Add Academic Year

    fetch("http://localhost:5001/api/teachers", {
      method: "POST",
      body: formData, // Send FormData instead of JSON
    })

      .then((res) => res.json())
      .then((data) => {
        setTeachers([...teachers, { ...newTeacher, id: data.id }]);
        setOpen(false);
        setNewTeacher({
          fullName: "",
          nameWithInitials: "",
          age: "",
          gender: "",
          contactNumber: "",
          email: "",
          address: "",
          enrollmentDate: "",
          documents: "",
          password: "",
          username: "",
          nic: "",
          previousSchools: "",
          status: "",
          leavingDate: "",
          role: "",
          grade:""
        });
        setProfilePhoto(null);
        
      })
      .catch((err) => console.error("Error adding teacher:", err));
  };



  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // Store the selected file in state
  };  

   // Modal Handling Functions
   const openModal = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const closeModal = () => {
    setSelectedTeacher(null);
  };


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    setTeachers((prevTeachers) => prevTeachers.filter((teacher) => {
      return (
        (filters.grade === "" || teacher.Grade === filters.grade) &&
        (filters.className === "" || teacher.Class_name === filters.className) &&
        (filters.name === "" || teacher.Full_name.toLowerCase().includes(filters.name.toLowerCase()))  // Add name filtering here

      );
    }));
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 bg-blue-900 flex flex-col">
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Teacher Management</h2>
        </div>

        <div className="p-6">
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Add New Teacher
          </Button>
        </div>

        <div className="p-7 flex gap-4 bg-white rounded-md shadow-md mx-4">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Grade</InputLabel>
            <Select name="grade" value={filters.grade} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select name="className" value={filters.className} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1A">1A</MenuItem>
              <MenuItem value="1B">1B</MenuItem>
              <MenuItem value="1C">1C</MenuItem>
              <MenuItem value="2A">2A</MenuItem>
              <MenuItem value="2B">2B</MenuItem>
              <MenuItem value="2C">2C</MenuItem>
              <MenuItem value="3A">3A</MenuItem>
              <MenuItem value="3B">3B</MenuItem>
              <MenuItem value="3C">3C</MenuItem>
            </Select>
          </FormControl>


          <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                fullWidth
              />
            </FormControl>
          
          <Button variant="contained" color="primary" onClick={handleFilterApply}>Filter</Button>
        </div>




        <div className="p-5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-black">
            <th className="border-2 border-black px-4 py-2 text-center"><b>Full Name</b></th>
            <th className="border-2 border-black px-4 py-2 text-center"><b>Class</b></th>
            <th className="border-2 border-black px-4 py-2 text-center"><b>Contact</b></th>
            <th className="border-2 border-black px-4 py-2 text-center"><b>Status</b></th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr
              key={teacher.Teacher_ID}
              className="border-b-2 border-black bg-gray-200 cursor-pointer hover:bg-gray-400"
              onClick={() => openModal(teacher)} // ✅ Correctly pass teacher data
            >
              <td className="border-2 border-black px-4 py-2 text-center">{teacher.Full_name}</td>
              <td className="border-2 border-black px-4 py-2 text-center">{teacher.Class_name}</td>
              <td className="border-2 border-black px-4 py-2 text-center">{teacher.Contact_number}</td>
              
              <td className="border-2 border-black px-4 py-2 text-center">
            <button className="text-red-500 hover:text-red-700">
              {teacher.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </button>
          </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 teacher Profile Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Teacher Details</h2>
              <button className="text-red-500 text-xl" onClick={closeModal}>✖</button>
            </div>

            {/* 🔹 Profile Layout */}
            <div className="flex">
              {/* Left Panel - Profile & Basic Info */}
              <div className="w-1/3 text-center border-r-2 pr-4">
                <img src={`http://localhost:5001/${selectedTeacher.Profile_photo}`}  alt="Profile" className="w-32 h-32 mx-auto rounded-full border-2 border-black" />
                <h3 className="font-semibold mt-2">{selectedTeacher.Full_name}</h3>
                <p>@{selectedTeacher.username}</p>
                <p className="text-sm">{selectedTeacher.Gender} </p>
              </div>

              {/* Right Panel - Full Details */}
              <div className="w-2/3 pl-4">
                <h3 className="font-semibold">📌 Teacher Information</h3>
                <p><b>🎂 Age:</b> {selectedTeacher.Age}</p>
                <p><b>🏠 Address:</b> {selectedTeacher.Address}</p>
                <p><b>📞 Contact:</b> {selectedTeacher.Contact_number} | {selectedTeacher.Email}</p>
                <p><b>📅 Enrollment Date:</b> {selectedTeacher.Joined_date}</p>
                <p><b>📂 Documents:</b> <a href={selectedTeacher.Documents} className="text-blue-500 underline">Download</a></p>

                

                {/* Actions */}
                <div className="mt-4 flex justify-between">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">✏️ Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">🗑️ Deactivate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


        {/* Add Teacher Form */}
<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
  <DialogTitle>Add New Teacher</DialogTitle>
  <DialogContent>
    <TextField fullWidth margin="dense" label="Full Name" name="fullName" value={newTeacher.fullName} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Name with Initials" name="nameWithInitials" value={newTeacher.nameWithInitials} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Age" name="age" value={newTeacher.age} onChange={handleChange} />
    <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newTeacher.gender} onChange={handleChange}>
      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
    </TextField>
    <TextField fullWidth margin="dense" select label="Status" name="status" value={newTeacher.status} onChange={handleChange}>
    <MenuItem value="Active">Active</MenuItem>
    <MenuItem value="Deactive">Deactive</MenuItem>
    </TextField>
    <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newTeacher.contactNumber} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Email" name="email" value={newTeacher.email} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Address" name="address" value={newTeacher.address} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newTeacher.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
    <TextField fullWidth margin="dense" label="Username" name="username" value={newTeacher.username} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newTeacher.password} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Previous Schools" name="previousSchools" value={newTeacher.previousSchools} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="NIC" name="nic"  value={newTeacher.nic} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Leaving Date" name="leavingDate" type="date" value={newTeacher.leavingDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
    <TextField fullWidth margin="dense" label="Role" name="role" value={newTeacher.role} onChange={handleChange} />

    <FormControl fullWidth margin="dense">
                <InputLabel>Grade</InputLabel>
                <Select
                    name="grade"
                    value={newTeacher.grade}
                    onChange={handleGradeChange}
                >
                    <MenuItem value="">Select Grade</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    {/* Add more grades as needed */}
                </Select>
                </FormControl>

            {newTeacher.grade && (
                <FormControl fullWidth margin="dense">
                    <InputLabel>Class</InputLabel>
                    <Select
                        name="className"
                        value={newTeacher.className}
                        onChange={handleChange}
                    >
                        {generateClassOptions().map((classOption) => (
                            <MenuItem key={classOption} value={classOption}>
                                {classOption}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}




    <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "15px" }} /> {/* Profile Photo Input */}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSubmit} color="primary">
      Submit
    </Button>
  </DialogActions>
</Dialog>

      </div>
    </div>
  );
};




export default TeacherManagement;