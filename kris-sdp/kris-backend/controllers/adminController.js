const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // Number of salt rounds for hashing


const storage = multer.diskStorage({
  destination: "./uploads/profile_pics",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

exports.getAdmins = (req, res) => {
  Admin.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching admins" });
    res.json(results);
  });
};

exports.addAdmin = (req, res) => {
  upload.single("profilePhoto")(req, res, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    }
    const {
      fullName, nameWithInitials, email, gender, age, address, contactNumber, status, 
      enrollmentDate, documents, password, username, nic, previousSchools, role
    } = req.body;

    console.log("Received admin data:", req.body); // Debugging

    const profilePhotoPath = req.file ? req.file.path : null; // Get uploaded file path

   

    // Hash the password using callbacks
        bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Error processing password" });
          }
      

      // Insert Admin
      const adminData = {
        Full_name: fullName, Name_with_initials: nameWithInitials, Age: age, Contact_number: contactNumber, Email: email, NIC: nic, 
        Previous_Schools: previousSchools, Documents: documents,Joined_date: enrollmentDate, 
        Status: status, password: hashedPassword, username: username, role:role, Gender: gender, Address: address,  
             
        Profile_photo: profilePhotoPath // Store image path in database
      };

      Admin.create(adminData, (err, adminResult) => {
        if (err) {
          console.error("Error adding admin:", err);
          return res.status(500).json({ error: "Error adding admin" });
        }

        console.log("Admin added with ID:", adminResult.insertId);
        res.json({ 
          message: "Admin added successfully", 
          adminID: adminResult.insertId,
          profilePhoto: profilePhotoPath
        });
      });
    });

   
  });
};

exports.updateAdminStatus = (req, res) => {
  const adminId = req.params.id;
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  Admin.updateStatus(adminId, status, (err, result) => {
    if (err) {
      console.error('Controller Error:', err);
      return res.status(500).json({ message: 'Failed to update status' });
    }

    res.status(200).json({ message: 'Status updated successfully' });
  });
};