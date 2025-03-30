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



const StuManagement = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
  const [selectedStudent, setSelectedStudent] = useState(null); // Added for modal functionality

  const [className, setClassName] = useState(""); // Store selected class

  const [filters, setFilters] = useState({
    grade: "",
    className: "",
    syllabus: "",
    name: "", 
  });



  const [newStudent, setNewStudent] = useState({
    fullName: "",
    nameWithInitials: "",
    dob: "",
    gender: "",
    grade: "",
    religion: "",
    vaccination: "",
    onAnyDrugs: "",
    allergies: "",
    contactNumber: "",
    email: "",
    address: "",
    enrollmentDate: "",
    syllabus: "",
    sistersBrothersInSameSchool: "", // Added missing field
    documents: "",
    password: "",
    username: "",
    adminID: "",
    //parentID: "",
    fatherName: "",
    fatherContact: "",
    fatherNIC: "",
    fatherAddress: "",
    fatherOccupation: "",
    motherName: "",
    motherContact: "",
    motherNIC: "",
    motherAddress: "",
    motherOccupation: "",
    grade: "",
    className: ""
  });

  useEffect(() => {
    fetch("http://localhost:5001/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Function to handle grade selection and generate class options
  const handleGradeChange = (event) => {
    const selectedGrade = event.target.value;
    setNewStudent({
        ...newStudent,
        grade: selectedGrade,
        className: `${selectedGrade}A`  // Set default class as "1A" for example
    });
};

// Generate class options based on grade
const generateClassOptions = () => {
    const classes = [];
    const grade = newStudent.grade;

    if (grade) {
        for (let i = 1; i <= 3; i++) {  // assuming you have 3 classes per grade
            classes.push(`${grade}${String.fromCharCode(64 + i)}`); // 65 -> A, 66 -> B, etc.
        }
    }

    return classes;
};


  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(newStudent).forEach((key) => {
      formData.append(key, newStudent[key]);
    });
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    formData.append("academicYear", new Date().getFullYear()); // Add Academic Year

    fetch("http://localhost:5001/api/students", {
      method: "POST",
      body: formData, // Send FormData instead of JSON
    })

      .then((res) => res.json())
      .then((data) => {
        setStudents([...students, { ...newStudent, id: data.id }]);
        setOpen(false);
        setNewStudent({
          fullName: "",
          nameWithInitials: "",
          dob: "",
          gender: "",
          grade: "",
          religion: "",
          vaccination: "",
          onAnyDrugs: "",
          allergies: "",
          contactNumber: "",
          email: "",
          address: "",
          enrollmentDate: "",
          syllabus: "",
          sistersBrothersInSameSchool: "", 
          documents: "",
          password: "",
          username: "",
          adminID: "",
          parentID: "",
          fatherName: "",
          fatherContact: "",
          fatherNIC: "",
          fatherAddress: "",
          fatherOccupation: "",
          motherName: "",
          motherContact: "",
          motherNIC: "",
          motherAddress: "",
          motherOccupation: "",
        });
        setProfilePhoto(null);
        setStep(1);
      })
      .catch((err) => console.error("Error adding student:", err));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // Store the selected file in state
  };
  

   // Modal Handling Functions
   const openModal = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    setStudents((prevStudents) => prevStudents.filter((student) => {
      return (
        (filters.grade === "" || student.Grade === filters.grade) &&
        (filters.className === "" || student.Class_name === filters.className) &&
        (filters.syllabus === "" || student.Syllabus === filters.syllabus) &&
        (filters.name === "" || student.Full_name.toLowerCase().includes(filters.name.toLowerCase()))  // Add name filtering here

      );
    }));
  };
  


  

  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 bg-blue-900 flex flex-col">
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Student Management</h2>
        </div>

        <div className="p-6">
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Add New Student
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
            <InputLabel>Syllabus</InputLabel>
            <Select name="syllabus" value={filters.syllabus} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Local">Local</MenuItem>
              <MenuItem value="Edexcel">Edexcel</MenuItem>
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
            <th className="border-2 border-black px-4 py-2 text-center"><b>Syllabus</b></th>
            <th className="border-2 border-black px-4 py-2 text-center"><b>Status</b></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.Student_ID}
              className="border-b-2 border-black bg-gray-200 cursor-pointer hover:bg-gray-400"
              onClick={() => openModal(student)} // ✅ Correctly pass student data
            >
              <td className="border-2 border-black px-4 py-2 text-center">{student.Full_name}</td>
              <td className="border-2 border-black px-4 py-2 text-center">{student.Class_name}</td>

              <td className="border-2 border-black px-4 py-2 text-center">{student.Contact_number}</td>
              <td className="border-2 border-black px-4 py-2 text-center">{student.Syllabus}</td>
              
              <td className="border-2 border-black px-4 py-2 text-center">
            <button className="text-red-500 hover:text-red-700">
              {student.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </button>
          </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button className="text-red-500 text-xl" onClick={closeModal}>✖</button>
            </div>

            {/* 🔹 Profile Layout */}
            <div className="flex">
              {/* Left Panel - Profile & Basic Info */}
              <div className="w-1/3 text-center border-r-2 pr-4">
                <img src={`http://localhost:5001/${selectedStudent.Profile_photo}`}  alt="Profile" className="w-32 h-32 mx-auto rounded-full border-2 border-black" />
                <h3 className="font-semibold mt-2">{selectedStudent.Full_name}</h3>
                <p>@{selectedStudent.username}</p>
                <p className="text-sm">{selectedStudent.Gender} | {selectedStudent.Religion}</p>
              </div>

              {/* Right Panel - Full Details */}
              <div className="w-2/3 pl-4">
                <h3 className="font-semibold">📌 Student Information</h3>
                <p><b>🎂 DOB:</b> {selectedStudent.Date_of_birth}</p>
                <p><b>🏠 Address:</b> {selectedStudent.Address}</p>
                <p><b>📞 Contact:</b> {selectedStudent.Contact_number} | {selectedStudent.Email}</p>
                <p><b>📚 Syllabus & Grade:</b> {selectedStudent.Syllabus} | {selectedStudent.Grade}</p>
                <p><b>💉 Vaccination:</b> {selectedStudent.Immunization}</p>
                <p><b>🏫 Siblings in School?</b> {selectedStudent.Sisters_brothers_in_same_school ? "Yes" : "No"}</p>
                <p><b>📅 Enrollment Date:</b> {selectedStudent.Joined_date}</p>
                <p><b>📂 Documents:</b> <a href={selectedStudent.Documents} className="text-blue-500 underline">Download</a></p>

                {/* Parent Info */}
                <h3 className="font-semibold mt-4">👨‍👩‍👧 Parent Information</h3>
                <p><b>🧔 Father:</b> {selectedStudent.Father_name} | {selectedStudent.Father_contact}</p>
                <p><b>👩 Mother:</b> {selectedStudent.Mother_name} | {selectedStudent.Mother_contact}</p>

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


        {/* add student form */}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>{step === 1 ? "Add New Student" : "Parent Details"}</DialogTitle>
          <DialogContent>
            {step === 1 ? (
              <>
                <TextField fullWidth margin="dense" label="Full Name" name="fullName" value={newStudent.fullName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Name with Initials" name="nameWithInitials" value={newStudent.nameWithInitials} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Date of Birth" name="dob" type="date" value={newStudent.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newStudent.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
                <TextField fullWidth margin="dense" label="Religion" name="religion" value={newStudent.religion} onChange={handleChange} />
                <TextField fullWidth margin="dense" select label="Syllabus" name="syllabus" value={newStudent.syllabus} onChange={handleChange}>
                  <MenuItem value="Local">Local</MenuItem>
                  <MenuItem value="Edexcel">Edexcel</MenuItem>
                </TextField>
                <TextField fullWidth margin="dense" label="Vaccination Details" name="vaccination" value={newStudent.vaccination} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="On Any Drugs" name="onAnyDrugs" value={newStudent.onAnyDrugs} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Allergies" name="allergies" value={newStudent.allergies} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newStudent.contactNumber} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Email" name="email" value={newStudent.email} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Address" name="address" value={newStudent.address} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Sisters/Brothers in the Same School" name="sistersBrothersInSameSchool" value={newStudent.sistersBrothersInSameSchool} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newStudent.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField fullWidth margin="dense" label="Username" name="username" value={newStudent.username} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newStudent.password} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Admin_Id" name="adminID" value={newStudent.adminID} onChange={handleChange} />

                <FormControl fullWidth margin="dense">
                <InputLabel>Grade</InputLabel>
                <Select
                    name="grade"
                    value={newStudent.grade}
                    onChange={handleGradeChange}
                >
                    <MenuItem value="">Select Grade</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    {/* Add more grades as needed */}
                </Select>
                </FormControl>

            {newStudent.grade && (
                <FormControl fullWidth margin="dense">
                    <InputLabel>Class</InputLabel>
                    <Select
                        name="className"
                        value={newStudent.className}
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

                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "15px" }} /> {/* Added file input */}

               

              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Father's Details</h3>
                <TextField fullWidth margin="dense" label="Name" name="fatherName" value={newStudent.fatherName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="fatherContact" value={newStudent.fatherContact} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="NIC" name="fatherNIC" value={newStudent.fatherNIC} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Occupation" name="fatherOccupation" value={newStudent.fatherOccupation} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Office - Address" name="fatherAddress" value={newStudent.fatherAddress} onChange={handleChange} />

                <h3 className="text-lg font-bold mt-6 mb-4">Mother's Details</h3>
                <TextField fullWidth margin="dense" label="Name" name="motherName" value={newStudent.motherName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="motherContact" value={newStudent.motherContact} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="NIC" name="motherNIC" value={newStudent.motherNIC} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Occupation" name="motherOccupation" value={newStudent.motherOccupation} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Office - Address" name="motherAddress" value={newStudent.motherAddress} onChange={handleChange} />

              </>
            )}
          </DialogContent>

          <DialogActions>
            {step === 1 ? (
              <>
                <Button onClick={() => setOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)} color="primary">
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setStep(1)} color="secondary">
                  Back
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Save & Submit
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default StuManagement;