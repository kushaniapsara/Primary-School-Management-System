import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

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

import { FormControl, InputLabel, Select } from "@mui/material";

const StuManagement = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
  const [selectedStudent, setSelectedStudent] = useState(null); // Added for modal functionality

  const [className, setClassName] = useState(""); // Store selected class

  const [selectedIds, setSelectedIds] = useState([]); //promoting
  const [newClassId, setNewClassId] = useState("");

  const [newClassName, setNewClassName] = useState("");
  const [newYear, setNewYear] = useState("");

  const [errors, setErrors] = useState({}); //for validatings

  const [editStudentMode, setEditStudentMode] = useState(false);
  const [pwChangeMode, setPwChangeMode] = useState(false);
  const [editParentMode, setEditParentMode] = useState(false);
  const [editableStudent, setEditableStudent] = useState(null);
  const [newPw, setNewPw] = useState(null);
  const [value, setValue] = React.useState(0);

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  // const [selectedStudents, setSelectedStudents] = useState([]);  // Stores the selected students
  //const [newClassName, setNewClassName] = useState('');  // Stores the new class name
  //const [newAcademicYear, setNewAcademicYear] = useState('');  // Stores the new academic year

  console.log(students);
  console.log(editableStudent);

  const [filters, setFilters] = useState({
    grade: "",
    className: "",
    syllabus: "",
    name: "",
    academicYear: "",
    status: "",
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
    monthly_amount: "",
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
    className: "",
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
      className: `${selectedGrade}A`, // Set default class as "1A" for example
    });
  };

  // Generate class options based on grade
  const generateClassOptions = () => {
    const classes = [];
    const grade = newStudent.grade;

    if (grade) {
      for (let i = 1; i <= 3; i++) {
        // assuming you have 3 classes per grade
        classes.push(`${grade}${String.fromCharCode(64 + i)}`); // 65 -> A, 66 -> B, etc.
      }
    }

    return classes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewStudent((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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
          monthly_amount: "",
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
    setEditableStudent({ ...student });
    setEditStudentMode(false);
    setEditParentMode(false);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setEditStudentMode(false);
    setEditParentMode(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => {
        return (
          (filters.grade === "" || student.Grade === filters.grade) &&
          (filters.className === "" ||
            student.Class_name === filters.className) &&
          (filters.syllabus === "" || student.Syllabus === filters.syllabus) &&
          (filters.name === "" ||
            student.Full_name.toLowerCase().includes(
              filters.name.toLowerCase()
            )) && // Add name filtering here
          (filters.academicYear === "" ||
            String(student.Academic_year) === filters.academicYear) &&
          (filters.status === "" || String(student.Status) === filters.status)
        );
      })
    );
  };

  //checkboxes
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s.Student_ID));
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
      const response = await fetch(
        "http://localhost:5001/api/students/promote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentIds: selectedIds,
            newClassName: newClassName,
            newYear: newYear,
          }),
        }
      );

      const data = await response.json(); // parse JSON from response
      console.log("Backend response:", data);
      alert("Students promoted successfully!");
    } catch (error) {
      console.error("Error promoting students:", error);
    }
  };

  const toggleStatus = async (studentId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await fetch(
        `http://localhost:5001/api/students/${studentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        // Update status locally after successful update
        setStudents((prev) =>
          prev.map((s) =>
            s.Student_ID === studentId ? { ...s, Status: newStatus } : s
          )
        );
      } else {
        console.error("Failed to update status");
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
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();

          // Adjust age if birth month/day hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
          }

          if (isNaN(birthDate.getTime())) {
            error = "Invalid date";
          } else if (age < 5) {
            error = "Student must be at least 5 years old";
          }
          break;

        case "enrollmentDate":
          if (isNaN(Date.parse(value))) {
            error = "Invalid date";
          }
          break;

        case "contactNumber":
        case "fatherContact":
        case "motherContact":
          if (!/^\d{10}$/.test(value)) {
            error = "Contact must be 10 digits";
          }
          break;

        case "email":
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            error = "Invalid email format";
          }
          break;

        case "monthly_amount":
          if (isNaN(value)) {
            error = "Must be a number";
          }
          break;

        case "password":
          if (value.length < 6) {
            error = "Password too short";
          }
          break;

        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleStudentUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/students/${selectedStudent.Student_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Full_name: editableStudent.Full_name,
            Date_of_birth: editableStudent.Date_of_birth,
            Address: editableStudent.Address,
            Contact_number: editableStudent.Contact_number,
            Email: editableStudent.Email,
            Syllabus: editableStudent.Syllabus,
            Immunization: editableStudent.Immunization,
            On_any_drugs: editableStudent.On_any_drugs,
            Sisters_brothers_in_same_school:
              editableStudent.Sisters_brothers_in_same_school,
            Joined_date: editableStudent.Joined_date,
            monthly_amount: editableStudent.monthly_amount,
            Documents: editableStudent.Documents,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Student updated successfully!");
        setEditStudentMode(false);

        // Optionally update student list state
        setStudents((prev) =>
          prev.map((s) =>
            s.Student_ID === editableStudent.Student_ID
              ? { ...s, ...editableStudent }
              : s
          )
        );
      } else {
        console.error("Update failed:", result);
        alert(result.message || "Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }
  };

  const handleParentUpdate = async () => {
    try {
      console.log("Updating parent info for student ID:", selectedStudent);
      const response = await fetch(
        `http://localhost:5001/api/parents/${selectedStudent.Parent_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Father_name: editableStudent.Father_name,
            Father_contact: editableStudent.Father_contact,
            Father_NIC: editableStudent.Father_NIC,
            Father_address: editableStudent.Father_address,
            Father_occupation: editableStudent.Father_occupation,
            Mother_name: editableStudent.Mother_name,
            Mother_contact: editableStudent.Mother_contact,
            Mother_NIC: editableStudent.Mother_NIC,
            Mother_address: editableStudent.Mother_address,
            Mother_occupation: editableStudent.Mother_occupation,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Parent information updated successfully!");
        setEditParentMode(false);

        setStudents((prev) =>
          prev.map((s) =>
            s.Student_ID === editableStudent.Student_ID
              ? { ...s, ...editableStudent }
              : s
          )
        );
      } else {
        console.error("Parent update failed:", result);
        alert(result.message || "Failed to update parent info");
      }
    } catch (error) {
      console.error("Error updating parent info:", error);
      alert("Error updating parent info");
    }
  };

  const handleStudentChange = useCallback((e) => {
    const { name, value } = e.target;

    setEditableStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const submitPwChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/students/changepw/${selectedStudent.Student_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPw: newPw,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        setPwChangeMode(false);
        setNewPw(null); // Reset new password field
      } else {
        console.error("Password change failed:", result);
        alert(result.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 bg-blue-900 flex flex-col">
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-bold">Student Management</h2>
        </div>

        <div className="p-6">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add New Student
          </Button>
        </div>

        <div className="p-7 flex gap-4 bg-white rounded-md shadow-md mx-4">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Grade</InputLabel>
            <Select
              name="grade"
              value={filters.grade}
              onChange={handleFilterChange}
            >
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
            <Select
              name="className"
              value={filters.className}
              onChange={handleFilterChange}
            >
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
            <InputLabel>Syllabus</InputLabel>
            <Select
              name="syllabus"
              value={filters.syllabus}
              onChange={handleFilterChange}
            >
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

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Academic_year</InputLabel>
            <Select
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
            >
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
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterApply}
          >
            Filter
          </Button>
        </div>

        {/* Promote Students */}
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
                    checked={
                      students.length > 0 &&
                      selectedIds.length === students.length
                    }
                    onChange={toggleSelectAll}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
                {/*existing headers */}
                <th className="border-2 border-black px-4 py-2 text-center">
                  Student ID
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Student Name
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Class
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Academic Year
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Contact
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Syllabus
                </th>
                <th className="border-2 border-black px-4 py-2 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.Student_ID}
                  className="border-b-2 border-black bg-gray-200 cursor-pointer hover:bg-gray-400"
                  onClick={() => openModal(student)} // ✅ Correctly pass student data
                >
                  <td
                    className="border-2 border-black px-4 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.Student_ID)}
                      onChange={() => toggleSelect(student.Student_ID)}
                    />
                  </td>

                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Student_ID}
                  </td>

                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Full_name}
                  </td>
                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Class_name}
                  </td>
                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Academic_year}
                  </td>

                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Contact_number}
                  </td>
                  <td className="border-2 border-black px-4 py-2 text-center">
                    {student.Syllabus}
                  </td>

                  <td
                    className="border-2 border-black px-4 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`text-white px-2 py-1 rounded ${
                        student.Status === "active"
                          ? "bg-green-500 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(student.Student_ID, student.Status);
                      }}
                    >
                      {student.Status === "active" ? (
                        <ToggleOnIcon />
                      ) : (
                        <ToggleOffIcon />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Student Profile Modal */}
          {selectedStudent && (
            <Modal
              open={!!selectedStudent}
              onClose={closeModal}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={!!selectedStudent}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: 1000,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Student Details</h2>
                    <button
                      className="text-red-500 text-xl"
                      onClick={closeModal}
                    >
                      ✖
                    </button>
                  </div>

                  <div className="flex">
                    <div className="w-1/3 text-center border-r-2 pr-4">
                      <img
                        src={`http://localhost:5001/${selectedStudent?.Profile_photo}`}
                        alt="Profile"
                        className="w-32 h-32 mx-auto rounded-full border-2 border-black"
                      />
                      <h3 className="font-semibold mt-2">
                        {selectedStudent?.Full_name}
                      </h3>
                      <p className="text-sm">
                        {selectedStudent?.Gender} | {selectedStudent?.Religion}
                      </p>
                    </div>

                    <div className="w-2/3 pl-4">
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            value={value}
                            onChange={handleChangeTabs}
                            aria-label="basic tabs example"
                          >
                            <Tab
                              label="Student Information"
                              {...a11yProps(0)}
                            />
                            <Tab label="Parent Information" {...a11yProps(1)} />
                          </Tabs>
                        </Box>

                        <CustomTabPanel value={value} index={0}>
                          {editStudentMode ? (
                            <>
                              <TextField
                                fullWidth
                                margin="dense"
                                label="DOB"
                                name="Date_of_birth"
                                type="date"
                                value={editableStudent?.Date_of_birth || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Address"
                                name="Address"
                                value={editableStudent?.Address || ""}
                                onChange={handleStudentChange}
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Contact Number"
                                name="Contact_number"
                                value={editableStudent?.Contact_number || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Email"
                                name="Email"
                                value={editableStudent?.Email || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Syllabus"
                                name="Syllabus"
                                value={editableStudent?.Syllabus || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Vaccination"
                                name="Immunization"
                                value={editableStudent?.Immunization || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="On any Drugs"
                                name="On_any_drugs"
                                value={editableStudent?.On_any_drugs || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Siblings in Same School"
                                name="Sisters_brothers_in_same_school"
                                value={
                                  editableStudent?.Sisters_brothers_in_same_school ||
                                  ""
                                }
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Monthly Amount"
                                name="monthly_amount"
                                value={editableStudent?.monthly_amount || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                type="date"
                                label="Enrollment Date"
                                name="Joined_date"
                                value={editableStudent?.Joined_date || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Documents"
                                name="Documents"
                                value={editableStudent?.Documents || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <p>
                                <b>🎂 DOB:</b>{" "}
                                {dayjs(editableStudent?.Date_of_birth).format(
                                  "YYYY-MM-DD"
                                )}
                              </p>
                              <p>
                                <b>🏠 Address:</b> {editableStudent?.Address}
                              </p>
                              <p>
                                <b>📞 Contact:</b>{" "}
                                {editableStudent?.Contact_number} |{" "}
                                {editableStudent?.Email}
                              </p>
                              <p>
                                <b>📚 Syllabus & Grade:</b>{" "}
                                {editableStudent?.Syllabus} |{" "}
                                {editableStudent?.Grade}
                              </p>
                              <p>
                                <b>💉 Vaccination:</b>{" "}
                                {editableStudent?.Immunization}
                              </p>
                              <p>
                                <b>🍶 On any Drugs</b>{" "}
                                {editableStudent?.On_any_drugs}
                              </p>
                              <p>
                                <b>🏫 Siblings in School?</b>{" "}
                                {
                                  editableStudent?.Sisters_brothers_in_same_school
                                }
                              </p>
                              <p>
                                <b>📅 Enrollment Date:</b>{" "}
                                {dayjs(editableStudent?.Joined_date).format(
                                  "YYYY-MM-DD"
                                )}
                              </p>
                              <p>
                                <b>💲 Mothly Amount:</b>{" "}
                                {`Rs ${editableStudent?.monthly_amount}`}
                              </p>
                              <p>
                                <b>📂 Documents:</b>{" "}
                                {editableStudent?.Documents}
                              </p>
                            </>
                          )}
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={1}>
                          <h3 className="font-semibold text-lg mb-2">
                            👨‍👩‍👧 Father's Information
                          </h3>
                          {editParentMode ? (
                            <>
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Name"
                                name="Father_name"
                                value={editableStudent?.Father_name || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Contact Number"
                                name="Father_contact"
                                value={editableStudent?.Father_contact || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="NIC"
                                name="Father_NIC"
                                value={editableStudent?.Father_NIC || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Address"
                                name="Father_address"
                                value={editableStudent?.Father_address || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Occupation"
                                name="Father_occupation"
                                value={editableStudent?.Father_occupation || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <p>
                                <b>👨 Name:</b> {selectedStudent.Father_name}
                              </p>
                              <p>
                                <b>📞 Contact:</b>{" "}
                                {selectedStudent.Father_contact}
                              </p>
                              <p>
                                <b>🆔 NIC:</b> {selectedStudent.Father_NIC}
                              </p>
                              <p>
                                <b>🏠 Address:</b>{" "}
                                {selectedStudent.Father_address}
                              </p>
                              <p>
                                <b>💼 Occupation:</b>{" "}
                                {selectedStudent.Father_occupation}
                              </p>
                            </>
                          )}

                          <h3 className="font-semibold text-lg mt-6 mb-2">
                            👩 Mother's Information
                          </h3>
                          {editParentMode ? (
                            <>
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Name"
                                name="Mother_name"
                                value={editableStudent?.Mother_name || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Contact Number"
                                name="Mother_contact"
                                value={editableStudent?.Mother_contact || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="NIC"
                                name="Mother_NIC"
                                value={editableStudent?.Mother_NIC || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Address"
                                name="Mother_address"
                                value={editableStudent?.Mother_address || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                              <TextField
                                fullWidth
                                margin="dense"
                                label="Occupation"
                                name="Mother_occupation"
                                value={editableStudent?.Mother_occupation || ""}
                                onChange={(e) =>
                                  setEditableStudent({
                                    ...editableStudent,
                                    [e.target.name]: e.target.value,
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <p>
                                <b>👩 Name:</b> {selectedStudent.Mother_name}
                              </p>
                              <p>
                                <b>📞 Contact:</b>{" "}
                                {selectedStudent.Mother_contact}
                              </p>
                              <p>
                                <b>🆔 NIC:</b> {selectedStudent.Mother_NIC}
                              </p>
                              <p>
                                <b>🏠 Address:</b>{" "}
                                {selectedStudent.Mother_address}
                              </p>
                              <p>
                                <b>💼 Occupation:</b>{" "}
                                {selectedStudent.Mother_occupation}
                              </p>
                            </>
                          )}
                        </CustomTabPanel>
                      </Box>

                      <div className="mt-4 flex justify-between">
                        {value === 0 && (
                          <>
                            {!pwChangeMode ? (
                              <button
                                className={`${
                                  editStudentMode
                                    ? "bg-gray-500"
                                    : "bg-blue-500"
                                } text-white px-4 py-2 rounded`}
                                onClick={() =>
                                  setEditStudentMode((prev) => !prev)
                                }
                              >
                                {editStudentMode
                                  ? "Cancel"
                                  : "✏️ Edit Student Info"}
                              </button>
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                label="Enter New Password"
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                              />
                            )}
                            {!pwChangeMode && !editStudentMode ? (
                              <button
                                className={`${
                                  editStudentMode
                                    ? "bg-gray-500"
                                    : "bg-blue-500"
                                } text-white px-4 py-2 rounded`}
                                onClick={() => setPwChangeMode((prev) => !prev)}
                              >
                                Change Password
                              </button>
                            ) : !editStudentMode ? (
                              <Box display="flex" ml={2} gap={2}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() =>
                                    setPwChangeMode((prev) => !prev)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={submitPwChange}
                                  disabled={!newPw}
                                >
                                  Change
                                </Button>
                              </Box>
                            ) : (
                              ""
                            )}
                            {editStudentMode && (
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleStudentUpdate}
                              >
                                Save Student Info
                              </button>
                            )}
                          </>
                        )}

                        {value === 1 && (
                          <>
                            {!pwChangeMode ? (
                              <button
                                className={`${
                                  editParentMode ? "bg-gray-500" : "bg-blue-500"
                                } text-white px-4 py-2 rounded`}
                                onClick={() =>
                                  setEditParentMode((prev) => !prev)
                                }
                              >
                                {editParentMode
                                  ? "Cancel"
                                  : "✏️ Edit Parent Info"}
                              </button>
                            ) : (
                              <TextField
                                fullWidth
                                size="small"
                                label="Enter New Password"
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                              />
                            )}
                            {!pwChangeMode && !editParentMode ? (
                              <button
                                className={`${
                                  editParentMode ? "bg-gray-500" : "bg-blue-500"
                                } text-white px-4 py-2 rounded`}
                                onClick={() => setPwChangeMode((prev) => !prev)}
                              >
                                Change Password
                              </button>
                            ) : !editParentMode ? (
                              <Box display="flex" ml={2} gap={2}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() =>
                                    setPwChangeMode((prev) => !prev)
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={submitPwChange}
                                  disabled={!newPw}
                                >
                                  Change
                                </Button>
                              </Box>
                            ) : (
                              ""
                            )}
                            {editParentMode && (
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleParentUpdate}
                              >
                                Save Parent Info
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Box>
              </Fade>
            </Modal>
          )}
        </div>
        {/* add student form */}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {step === 1 ? "Add New Student" : "Parent Details"}
          </DialogTitle>
          <DialogContent>
            {step === 1 ? (
              <>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Full Name"
                  name="fullName"
                  value={newStudent.fullName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name with Initials"
                  name="nameWithInitials"
                  value={newStudent.nameWithInitials}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={newStudent.dob}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dob}
                  helperText={errors.dob}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  select
                  label="Gender"
                  name="gender"
                  value={newStudent.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Religion"
                  name="religion"
                  value={newStudent.religion}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  select
                  label="Syllabus"
                  name="syllabus"
                  value={newStudent.syllabus}
                  onChange={handleChange}
                >
                  <MenuItem value="Local">Local</MenuItem>
                  <MenuItem value="Edexcel">Edexcel</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Vaccination Details"
                  name="vaccination"
                  value={newStudent.vaccination}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="On Any Drugs"
                  name="onAnyDrugs"
                  value={newStudent.onAnyDrugs}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Allergies"
                  name="allergies"
                  value={newStudent.allergies}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Contact Number"
                  name="contactNumber"
                  value={newStudent.contactNumber}
                  onChange={handleChange}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Email"
                  name="email"
                  value={newStudent.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Address"
                  name="address"
                  value={newStudent.address}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Sisters/Brothers in the Same School"
                  name="sistersBrothersInSameSchool"
                  value={newStudent.sistersBrothersInSameSchool}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Enrollment Date"
                  name="enrollmentDate"
                  type="date"
                  value={newStudent.enrollmentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Username"
                  name="username"
                  value={newStudent.username}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Password"
                  name="password"
                  type="password"
                  value={newStudent.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Admin_Id"
                  name="adminID"
                  value={newStudent.adminID}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Documents"
                  name="documents"
                  value={newStudent.documents}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="monthly_amount"
                  name="monthly_amount"
                  value={newStudent.monthly_amount}
                  onChange={handleChange}
                />
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginTop: "15px" }}
                />{" "}
                {/* Added file input */}
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Father's Details</h3>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  name="fatherName"
                  value={newStudent.fatherName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Contact Number"
                  name="fatherContact"
                  value={newStudent.fatherContact}
                  onChange={handleChange}
                  error={!!errors.fatherContact}
                  helperText={errors.fatherContact}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="NIC"
                  name="fatherNIC"
                  value={newStudent.fatherNIC}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Occupation"
                  name="fatherOccupation"
                  value={newStudent.fatherOccupation}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Office - Address"
                  name="fatherAddress"
                  value={newStudent.fatherAddress}
                  onChange={handleChange}
                />

                <h3 className="text-lg font-bold mt-6 mb-4">
                  Mother's Details
                </h3>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Name"
                  name="motherName"
                  value={newStudent.motherName}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Contact Number"
                  name="motherContact"
                  value={newStudent.motherContact}
                  onChange={handleChange}
                  error={!!errors.fatherContact}
                  helperText={errors.fatherContact}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="NIC"
                  name="motherNIC"
                  value={newStudent.motherNIC}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Occupation"
                  name="motherOccupation"
                  value={newStudent.motherOccupation}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Office - Address"
                  name="motherAddress"
                  value={newStudent.motherAddress}
                  onChange={handleChange}
                />
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={
                    ![
                      "fullName",
                      "nameWithInitials",
                      "dob",
                      "gender",
                      "grade",
                      "religion",
                      "vaccination",
                      "onAnyDrugs",
                      "allergies",
                      "contactNumber",
                      "email",
                      "address",
                      "enrollmentDate",
                      "syllabus",
                      "sistersBrothersInSameSchool",
                      "documents",
                      "password",
                      "username",
                      "adminID",
                      "monthly_amount",
                      "fatherName",
                      "fatherContact",
                      "fatherNIC",
                      "fatherAddress",
                      "fatherOccupation",
                      "motherName",
                      "motherContact",
                      "motherNIC",
                      "motherAddress",
                      "motherOccupation",
                      "className",
                    ].every((field) => {
                      const value = newStudent[field];
                      if (typeof value === "string") return value.trim() !== "";
                      if (typeof value === "boolean") return true;
                      if (value instanceof File || value instanceof Blob)
                        return true;
                      return (
                        value !== null && value !== undefined && value !== ""
                      );
                    })
                  }
                >
                  Submit
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
