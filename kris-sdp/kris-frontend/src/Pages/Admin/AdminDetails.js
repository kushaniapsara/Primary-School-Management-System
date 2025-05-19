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



const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  //const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Added for modal functionality
  const [errors, setErrors] = useState({}); //for validatings

  const [filters, setFilters] = useState({

    name: "",
    status: ""
  });

  const [newAdmin, setNewAdmin] = useState({
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


  });

  useEffect(() => {
    fetch("http://localhost:5001/api/admins")
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;


    setNewAdmin((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(newAdmin).forEach((key) => {
      formData.append(key, newAdmin[key]);
    });
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    fetch("http://localhost:5001/api/admins", {
      method: "POST",
      body: formData, // Send FormData instead of JSON
    })

      .then((res) => res.json())
      .then((data) => {
        setAdmins([...admins, { ...newAdmin, id: data.id }]);
        setOpen(false);
        setNewAdmin({
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
          role: ""
        });
        setProfilePhoto(null);

      })
      .catch((err) => console.error("Error adding admin:", err));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // Store the selected file in state
  };


  // Modal Handling Functions
  const openModal = (admin) => {
    setSelectedAdmin(admin);
  };

  const closeModal = () => {
    setSelectedAdmin(null);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterApply = () => {
    setAdmins((prevAdmins) => prevAdmins.filter((admin) => {
      return (
        (filters.name === "" || admin.Full_name.toLowerCase().includes(filters.name.toLowerCase())) &&  // Add name filtering here
        (filters.status === "" || String(admin.Status) === filters.status)


      );
    }));
  };



  const toggleStatus = async (adminId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch(`http://localhost:5001/api/admins/${adminId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update status locally after successful update
        setAdmins((prev) =>
          prev.map((s) =>
            s.Admin_ID === adminId ? { ...s, Status: newStatus } : s
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
        // case "dob":
        //   const birthDate = new Date(value);
        //   const today = new Date();
        //   let age = today.getFullYear() - birthDate.getFullYear();
        //   const monthDiff = today.getMonth() - birthDate.getMonth();
        //   const dayDiff = today.getDate() - birthDate.getDate();

        //   // Adjust age if birth month/day hasn't occurred yet this year
        //   if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        //     age--;
        //   }

        //   if (isNaN(birthDate.getTime())) {
        //     error = "Invalid date";
        //   } else if (age < 5) {
        //     error = "Student must be at least 5 years old";
        //   }
        //   break;

        case "enrollmentDate":
          if (isNaN(Date.parse(value))) {
            error = "Invalid date";
          }
          break;

        case "contactNumber":
          //case "fatherContact":
          //case "motherContact":
          if (!/^\d{10}$/.test(value)) {
            error = "Contact must be 10 digits";
          }
          break;

        case "email":
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            error = "Invalid email format";
          }
          break;

        // case "monthly_amount":
        //   if (isNaN(value)) {
        //     error = "Must be a number";
        //   }
        //   break;

        case "password":
          if (value.length < 6) {
            error = "Password too short";
          }
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
            <h2 className="text-2xl font-bold">Admin Details</h2>
          </div>

          <div className="p-6">
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
              Add New Admin
            </Button>
          </div>

          <div className="p-7 flex gap-4 bg-white rounded-md shadow-md mx-4">




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
              <InputLabel>Status</InputLabel>
              <Select name="status" value={filters.status} onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>


              </Select>
            </FormControl>


            <Button variant="contained" color="primary" onClick={handleFilterApply}>Filter</Button>
          </div>




          <div className="p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Admin ID</b></th>

                  <th className="border-2 border-black px-4 py-2 text-center"><b>Full Name</b></th>
                  {/*<th className="border-2 border-black px-4 py-2 text-center"><b>Class</b></th>*/}
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Contact</b></th>
                  <th className="border-2 border-black px-4 py-2 text-center"><b>Status</b></th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.Admin_ID}
                    className="border-b-2 border-black bg-gray-200 cursor-pointer hover:bg-gray-400"
                    onClick={() => openModal(admin)} // ✅ Correctly pass admin data
                  >
                    <td className="border-2 border-black px-4 py-2 text-center">{admin.Admin_ID}</td>

                    <td className="border-2 border-black px-4 py-2 text-center">{admin.Full_name}</td>
                    {/* <td className="border-2 border-black px-4 py-2 text-center">{admin.Class}</td>*/}
                    <td className="border-2 border-black px-4 py-2 text-center">{admin.Contact_number}</td>

                    <td
                      className="border-2 border-black px-4 py-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={`text-white px-2 py-1 rounded ${admin.Status === 'active' ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(admin.Admin_ID, admin.Status);
                        }}
                      >
                        {admin.Status === 'active' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🔹 admin Profile Modal */}
            {selectedAdmin && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Admin Details</h2>
                    <button className="text-red-500 text-xl" onClick={closeModal}>✖</button>
                  </div>

                  {/* 🔹 Profile Layout */}
                  <div className="flex">
                    {/* Left Panel - Profile & Basic Info */}
                    <div className="w-1/3 text-center border-r-2 pr-4">
                      <img src={`http://localhost:5001/${selectedAdmin.Profile_photo}`} alt="Profile" className="w-32 h-32 mx-auto rounded-full border-2 border-black" />
                      <h3 className="font-semibold mt-2">{selectedAdmin.Full_name}</h3>
                      <p>@{selectedAdmin.username}</p>
                      <p className="text-sm">{selectedAdmin.Gender} </p>
                    </div>

                    {/* Right Panel - Full Details */}
                    <div className="w-2/3 pl-4">
                      <h3 className="font-semibold">📌 Admin Information</h3>
                      <p><b>🎂 Age:</b> {selectedAdmin.Age}</p>
                      <p><b>🏠 Address:</b> {selectedAdmin.Address}</p>
                      <p><b>📞 Contact:</b> {selectedAdmin.Contact_number} | {selectedAdmin.Email}</p>
                      <p><b>📅 Enrollment Date:</b> {selectedAdmin.Joined_date}</p>
                      <p><b>📂 Documents:</b> <a href={selectedAdmin.Documents} className="text-blue-500 underline">Download</a></p>



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


          {/* Add Admin Form */}
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogContent>
              <TextField fullWidth margin="dense" label="Full Name" name="fullName" value={newAdmin.fullName} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Name with Initials" name="nameWithInitials" value={newAdmin.nameWithInitials} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Age" name="age" value={newAdmin.age} onChange={handleChange} error={!!errors.age} helperText={errors.age} />
              <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newAdmin.gender} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField fullWidth margin="dense" select label="Status" name="status" value={newAdmin.status} onChange={handleChange}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Deactive</MenuItem>
              </TextField>
              <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newAdmin.contactNumber} onChange={handleChange} error={!!errors.contactNumber} helperText={errors.contactNumber} />
              <TextField fullWidth margin="dense" label="Email" name="email" value={newAdmin.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
              <TextField fullWidth margin="dense" label="Address" name="address" value={newAdmin.address} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newAdmin.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth margin="dense" label="Username" name="username" value={newAdmin.username} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newAdmin.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />
              <TextField fullWidth margin="dense" label="Previous Schools" name="previousSchools" value={newAdmin.previousSchools} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="NIC" name="nic" value={newAdmin.nic} onChange={handleChange} />
              {/* <TextField fullWidth margin="dense" label="Leaving Date" name="leavingDate" type="date" value={newAdmin.leavingDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /> */}
              <TextField fullWidth margin="dense" label="Role" name="role" value={newAdmin.role} onChange={handleChange} />
              <TextField fullWidth margin="dense" label="Documents" name="documents" value={newAdmin.documents} onChange={handleChange} />


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
                    "nic", "previousSchools", "status", "role"

                  ].every((field) => {
                    const value = newAdmin[field];
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




export default AdminManagement;