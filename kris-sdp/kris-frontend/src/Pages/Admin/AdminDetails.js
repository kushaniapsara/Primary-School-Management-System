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


const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  //const [step, setStep] = useState(1); // Step control for multi-part form
  const [profilePhoto, setProfilePhoto] = useState(null); // Added for profile photo
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Added for modal functionality
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
    leavingDate: "",
    role: "",

    
  });

  useEffect(() => {
    fetch("http://localhost:5001/api/admins")
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);

  const handleChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
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
          leavingDate: "",
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

  
  return (
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


        <div className="p-5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-black">
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
              <td className="border-2 border-black px-4 py-2 text-center">{admin.Full_name}</td>
             {/* <td className="border-2 border-black px-4 py-2 text-center">{admin.Class}</td>*/}
              <td className="border-2 border-black px-4 py-2 text-center">{admin.Contact_number}</td>
              
              <td className="border-2 border-black px-4 py-2 text-center">
            <button className="text-red-500 hover:text-red-700">
              {admin.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
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
                <img src={`http://localhost:5001/${selectedAdmin.Profile_photo}`}  alt="Profile" className="w-32 h-32 mx-auto rounded-full border-2 border-black" />
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
                  <button className="bg-red-500 text-white px-4 py-2 rounded">🗑️ Deactivate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


        {/* Add Student Form */}
<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
  <DialogTitle>Add New Admin</DialogTitle>
  <DialogContent>
    <TextField fullWidth margin="dense" label="Full Name" name="fullName" value={newAdmin.fullName} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Name with Initials" name="nameWithInitials" value={newAdmin.nameWithInitials} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Age" name="age" value={newAdmin.age} onChange={handleChange} />
    <TextField fullWidth margin="dense" select label="Gender" name="gender" value={newAdmin.gender} onChange={handleChange}>
      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
    </TextField>
    <TextField fullWidth margin="dense" select label="Status" name="status" value={newAdmin.status} onChange={handleChange}>
    <MenuItem value="Active">Active</MenuItem>
    <MenuItem value="Deactive">Deactive</MenuItem>
    </TextField>
    <TextField fullWidth margin="dense" label="Contact Number" name="contactNumber" value={newAdmin.contactNumber} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Email" name="email" value={newAdmin.email} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Address" name="address" value={newAdmin.address} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Enrollment Date" name="enrollmentDate" type="date" value={newAdmin.enrollmentDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
    <TextField fullWidth margin="dense" label="Username" name="username" value={newAdmin.username} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Password" name="password" type="password" value={newAdmin.password} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Previous Schools" name="previousSchools" value={newAdmin.previousSchools} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="NIC" name="nic"  value={newAdmin.nic} onChange={handleChange} />
    <TextField fullWidth margin="dense" label="Leaving Date" name="leavingDate" type="date" value={newAdmin.leavingDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
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
                                 "nic", "previousSchools", "status", "leavingDate",
                                 "role"
   
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
  );
};




export default AdminManagement;