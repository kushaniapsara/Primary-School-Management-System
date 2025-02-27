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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";


const StuManagement = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
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
  });

  useEffect(() => {
    fetch("http://localhost:5001/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

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
          sistersBrothersInSameSchool: "", // Ensure it resets
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


        <div className="p-5">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100 border-b-2 border-black">
        <th className="border-2 border-black px-4 py-2 text-center"><b>Full Name</b></th>
        <th className="border-2 border-black px-4 py-2 text-center"><b>Grade</b></th>
        <th className="border-2 border-black px-4 py-2 text-center"><b>Contact</b></th>
        <th className="border-2 border-black px-4 py-2 text-center"><b>Syllabus</b></th>
        <th className="border-2 border-black px-4 py-2 text-center"><b>Edit</b></th>
        <th className="border-2 border-black px-4 py-2 text-center"><b>Activate/Deactivate</b></th>
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student.Student_ID} className="border-b-2 border-black bg-gray-200">
          <td className="border-2 border-black px-4 py-2 text-center">{student.Full_name}</td>
          <td className="border-2 border-black px-4 py-2 text-center">{student.Grade}</td>
          <td className="border-2 border-black px-4 py-2 text-center">{student.Contact_number}</td>
          <td className="border-2 border-black px-4 py-2 text-center">{student.Syllabus}</td>
          <td className="border-2 border-black px-4 py-2 text-center">
            <button className="text-blue-500 hover:text-blue-700">
              <EditIcon />
            </button>
          </td>
          <td className="border-2 border-black px-4 py-2 text-center">
            <button className="text-red-500 hover:text-red-700">
              {student.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        

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
                <TextField fullWidth margin="dense" label="Grade" name="grade" value={newStudent.grade} onChange={handleChange} />
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