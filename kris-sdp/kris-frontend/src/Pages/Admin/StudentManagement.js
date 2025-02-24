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

const ExtraActTeacher = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // Step control for multi-part form
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    dob: "",
    gender: "",
    grade: "",
    religion: "",
    vaccination: "",
    allergies: "",
    contactNumber: "",
    email: "",
    address: "",
    enrollmentDate: "",
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
    fetch("http://localhost:5001/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents([...students, { ...newStudent, id: data.id }]);
        setOpen(false);
        setNewStudent({
          fullName: "",
          dob: "",
          gender: "",
          grade: "",
          religion: "",
          vaccination: "",
          allergies: "",
          contactNumber: "",
          email: "",
          address: "",
          enrollmentDate: "",
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
        setStep(1);
      })
      .catch((err) => console.error("Error adding student:", err));
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

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>{step === 1 ? "Add New Student" : "Parent Details"}</DialogTitle>
          <DialogContent>
            {step === 1 ? (
              <>
                <TextField fullWidth margin="dense" label="Full Name" name="fullName" value={newStudent.fullName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Date of Birth" name="dob" type="date" value={newStudent.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newStudent.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField fullWidth margin="dense" label="Grade" name="grade" value={newStudent.grade} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Religion" name="religion" value={newStudent.religion} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Vaccination Details" name="vaccination" value={newStudent.vaccination} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Allergies & Drug Usage" name="allergies" value={newStudent.allergies} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newStudent.contactNumber} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Email" name="email" value={newStudent.email} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Address" name="address" value={newStudent.address} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newStudent.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Father's Details</h3>
                <TextField fullWidth margin="dense" label="Name" name="fatherName" value={newStudent.fatherName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="fatherContact" value={newStudent.fatherContact} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="NIC" name="fatherNIC" value={newStudent.fatherNIC} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Address" name="fatherAddress" value={newStudent.fatherAddress} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Occupation" name="fatherOccupation" value={newStudent.fatherOccupation} onChange={handleChange} />

                <h3 className="text-lg font-bold mt-6 mb-4">Mother's Details</h3>
                <TextField fullWidth margin="dense" label="Name" name="motherName" value={newStudent.motherName} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Contact Number" name="motherContact" value={newStudent.motherContact} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="NIC" name="motherNIC" value={newStudent.motherNIC} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Address" name="motherAddress" value={newStudent.motherAddress} onChange={handleChange} />
                <TextField fullWidth margin="dense" label="Occupation" name="motherOccupation" value={newStudent.motherOccupation} onChange={handleChange} />
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

export default ExtraActTeacher;
