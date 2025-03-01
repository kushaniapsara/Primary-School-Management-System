const Teacher = require("../models/teacher");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/profile_pics",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

exports.getTeachers = (req, res) => {
  Teacher.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching teachers" });
    res.json(results);
  });
};

exports.addTeacher = (req, res) => {
  upload.single("profilePhoto")(req, res, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    }
    const {
      fullName, nameWithInitials, email, gender, age, address, contactNumber, status, 
      enrollmentDate, documents, password, username, nic, previousSchools,leavingDate, role
    } = req.body;

    console.log("Received teacher data:", req.body); // Debugging

    const profilePhotoPath = req.file ? req.file.path : null; // Get uploaded file path

   

    
      

      // Insert Teacher
      const teacherData = {
        Full_name: fullName, Name_with_initials: nameWithInitials, Age: age, Contact_number: contactNumber, Email: email, NIC: nic, 
        Previous_Schools: previousSchools, Documents: documents,Joined_date: enrollmentDate, Leaving_date: leavingDate,
        Status: status, password: password, username: username, role:role, Gender: gender, Address: address,  
             
        Profile_photo: profilePhotoPath // Store image path in database
      };

      Teacher.create(teacherData, (err, teacherResult) => {
        if (err) {
          console.error("Error adding teacher:", err);
          return res.status(500).json({ error: "Error adding teacher" });
        }

        console.log("Teacher added with ID:", teacherResult.insertId);
        res.json({ 
          message: "Teacher added successfully", 
          teacherID: teacherResult.insertId,
          profilePhoto: profilePhotoPath
        });
      });
    });
  }

