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

  const [selectedIds, setSelectedIds] = useState([]);//promoting
  const [newClassId, setNewClassId] = useState("");

  const [newClassName, setNewClassName] = useState("");
  const [newYear, setNewYear] = useState("");

  const [errors, setErrors] = useState({});


  const [filters, setFilters] = useState({
    grade: "",
    className: "",
    name: "",
    academicYear: "",
    status: ""
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
    //leavingDate: "",
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
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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
          //leavingDate: "",
          role: "",
          grade: ""
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
        (filters.name === "" || teacher.Full_name.toLowerCase().includes(filters.name.toLowerCase())) && // Add name filtering here
        (filters.academicYear === "" || String(teacher.Academic_year) === filters.academicYear) &&
        (filters.status === "" || String(teacher.Status) === filters.status)


      );
    }));
  };

  //checkboxes
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(teachers.map((s) => s.Teacher_ID));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  //promoting
  const handlePromote = async () => {
    console.log("Clicked Promote");

    try {
      const response = await fetch("http://localhost:5001/api/teachers/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teacherIds: selectedIds,
          newClassName: newClassName,
          newYear: newYear
        })
      });

      const data = await response.json(); // parse JSON from response
      console.log("Backend response:", data);
      alert("Teachers promoted successfully!");
    } catch (error) {
      console.error("Error promoting teachers:", error);
    }
  };

  const toggleStatus = async (teacherId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch(`http://localhost:5001/api/teachers/${teacherId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update status locally after successful update
        setTeachers((prev) =>
          prev.map((s) =>
            s.Teacher_ID === teacherId ? { ...s, Status: newStatus } : s
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value || value.trim() === "") {
      error = "This field is required";
    } else {
      switch (name) {
        case "dob":
        case "enrollmentDate":
          if (isNaN(Date.parse(value))) error = "Invalid date";
          break;
        case "contactNumber":
          //case "fatherContact":
          //case "motherContact":
          if (!/^\d{10}$/.test(value)) error = "Contact must be 10 digits";
          break;
        case "email":
          if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
          break;
        // case "monthly_amount":
        //   if (isNaN(value)) error = "Must be a number";
        //   break;
        case "password":
          if (value.length < 6) error = "Password too short";
          break;
        case "age":
          if (!/^\d+$/.test(value)) error = "Age must be a valid number";
          else if (parseInt(value) < 18 || parseInt(value) > 60) error = "Age must be between 18 and 60";
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-40px)] overflow-y-auto bg-gray-100 p-6">

      <div className="flex h-screen overflow-hidden">
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
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
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

                <MenuItem value="4A">4A</MenuItem>
                <MenuItem value="4B">4B</MenuItem>
                <MenuItem value="4C">4C</MenuItem>
                <MenuItem value="5A">5A</MenuItem>
                <MenuItem value="5B">5B</MenuItem>
                <MenuItem value="5C">5C</MenuItem>
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

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Academic_year</InputLabel>
              <Select name="academicYear" value={filters.academicYear} onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
                <MenuItem value="2027">2027</MenuItem>
                <MenuItem value="2028">2028</MenuItem>
                <MenuItem value="2029">2029</MenuItem>

              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={filters.status} onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>


              </Select>
            </FormControl>


            <Button variant="contained" color="primary" onClick={handleFilterApply}>Filter</Button>
          </div>


          {/* Promote Teachers */}
          <div className="flex gap-4 mb-4 items-center mx-4 my-4">
            <select
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select New Class</option>
              <option value="1A">Grade 1A</option>
              <option value="1B">Grade 1B</option>
              <option value="1C">Grade 1C</option> {/* fixed value */}

              <option value="2A">Grade 2A</option>
              <option value="2B">Grade 2B</option>
              <option value="2C">Grade 2C</option>

              <option value="3A">Grade 3A</option>
              <option value="3B">Grade 3B</option>
              <option value="3C">Grade 3C</option>

              <option value="4A">Grade 4A</option>
              <option value="4B">Grade 4B</option>
              <option value="4C">Grade 4C</option>

              <option value="5A">Grade 5A</option>
              <option value="5B">Grade 5B</option>
              <option value="5C">Grade 5C</option>
            </select>

            <input
              type="text"
              placeholder="New Academic Year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              onClick={() => {
                console.log("Clicked Promote Button");
                handlePromote();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={selectedIds.length === 0 || !newClassName || !newYear}
            >
              Promote Selected
            </button>

          </div>



          <div className="p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-2 border-black px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={teachers.length > 0 && selectedIds.length === teachers.length}
                      onChange={toggleSelectAll}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Teacher ID</b></th>
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Full Name</b></th>
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Class</b></th>
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Academic Year</b></th>

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

                    <td
                      className="border-2 border-black px-4 py-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(teacher.Teacher_ID)}
                        onChange={() => toggleSelect(teacher.Teacher_ID)}
                      />
                    </td>

                    <td className="border-2 border-black px-4 py-2 text-center">{teacher.Teacher_ID}</td>

                    <td className="border-2 border-black px-4 py-2 text-center">{teacher.Full_name}</td>
                    <td className="border-2 border-black px-4 py-2 text-center">{teacher.Class_name}</td>
                    <td className="border-2 border-black px-4 py-2 text-center">{teacher.Academic_year}</td>

                    <td className="border-2 border-black px-4 py-2 text-center">{teacher.Contact_number}</td>

                    <td
                      className="border-2 border-black px-4 py-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={`text-white px-2 py-1 rounded ${teacher.Status === 'active' ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(teacher.Teacher_ID, teacher.Status);
                        }}
                      >
                        {teacher.Status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
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
                      <img src={`http://localhost:5001/${selectedTeacher.Profile_photo}`} alt="Profile" className="w-32 h-32 mx-auto rounded-full border-2 border-black" />
                      <h3 className="font-semibold mt-2">{selectedTeacher.Full_name}</h3>
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
              <TextField fullWidth margin="dense" label="Age" name="age" value={newTeacher.age} onChange={handleChange} error={!!errors.age} helperText={errors.age} />
              <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newTeacher.gender} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField fullWidth margin="dense" select label="Status" name="status" value={newTeacher.status} onChange={handleChange}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Deactive</MenuItem>
              </TextField>
              <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newTeacher.contactNumber} onChange={handleChange} error={!!errors.contactNumber} helperText={errors.contactNumber} />
              <TextField fullWidth margin="dense" label="Email" name="email" value={newTeacher.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
              <TextField fullWidth margin="dense" label="Address" name="address" value={newTeacher.address} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newTeacher.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth margin="dense" label="Username" name="username" value={newTeacher.username} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newTeacher.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />
              <TextField fullWidth margin="dense" label="Previous Schools" name="previousSchools" value={newTeacher.previousSchools} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="NIC" name="nic" value={newTeacher.nic} onChange={handleChange} />
              {/* <TextField fullWidth margin="dense" label="Leaving Date" name="leavingDate" type="date" value={newTeacher.leavingDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /> */}
              <TextField fullWidth margin="dense" label="Role" name="role" value={newTeacher.role} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Documents" name="documents" value={newTeacher.documents} onChange={handleChange} />



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
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>

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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  ![
                    "fullName", "nameWithInitials", "age", "gender", "contactNumber", "email",
                    "address", "enrollmentDate", "documents", "password", "username",
                    "nic", "previousSchools", "status",
                    "role", "grade"

                  ].every((field) => {
                    const value = newTeacher[field];
                    if (typeof value === "string") return value.trim() !== "";
                    if (typeof value === "boolean") return true;
                    if (value instanceof File || value instanceof Blob) return true;
                    return value !== null && value !== undefined && value !== "";
                  })
                }
              >
                Submit
              </Button>

            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
};




export default TeacherManagement;