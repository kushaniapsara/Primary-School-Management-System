const Student = require("../models/Student");
const Parent = require("../models/Parent");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/profile_pics",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

exports.getStudents = (req, res) => {
  Student.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching students" });
    res.json(results);
  });
};

exports.addStudent = (req, res) => {
  upload.single("profilePhoto")(req, res, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    }

    const {
      fullName, nameWithInitials, email, gender, religion, dob, address, contactNumber, syllabus, vaccination, 
      onAnyDrugs, allergies, sistersBrothersInSameSchool, enrollmentDate, documents, password, adminID, username,
      fatherName, fatherContact, fatherNIC, fatherAddress, fatherOccupation,
      motherName, motherContact, motherNIC, motherAddress, motherOccupation
    } = req.body;

    console.log("Received student data:", req.body); // Debugging

    const profilePhotoPath = req.file ? req.file.path : null; // Get uploaded file path

    // Insert Parent First
    const parentData = {
      Father_name: fatherName, Father_contact: fatherContact, Father_NIC: fatherNIC,
      Father_address: fatherAddress, Father_occupation: fatherOccupation,
      Mother_name: motherName, Mother_contact: motherContact, Mother_NIC: motherNIC,
      Mother_address: motherAddress, Mother_occupation: motherOccupation
    };

    Parent.create(parentData, (err, parentResult) => {
      if (err) {
        console.error("Error adding parent:", err);
        return res.status(500).json({ error: "Error adding parent" });
      }

      const parentID = parentResult.insertId;
      console.log("Parent added with ID:", parentID);

      // Insert Student
      const studentData = {
        Full_name: fullName, Name_with_initials: nameWithInitials, Email: email, Gender: gender, Religion: religion,
        Date_of_birth: dob, Address: address, Contact_number: contactNumber, Syllabus: syllabus, Immunization: vaccination, 
        On_any_drugs: onAnyDrugs, Allergies: allergies, Sisters_brothers_in_same_school: sistersBrothersInSameSchool, 
        Joined_date: enrollmentDate, Documents: documents, password: password, Admin_ID: adminID, Parent_ID: parentID, username: username,
        Profile_photo: profilePhotoPath // Store image path in database
      };

      Student.create(studentData, (err, studentResult) => {
        if (err) {
          console.error("Error adding student:", err);
          return res.status(500).json({ error: "Error adding student" });
        }

        console.log("Student added with ID:", studentResult.insertId);
        res.json({ 
          message: "Student added successfully", 
          studentID: studentResult.insertId,
          parentID: parentID,
          profilePhoto: profilePhotoPath
        });
      });
    });
  });
};
