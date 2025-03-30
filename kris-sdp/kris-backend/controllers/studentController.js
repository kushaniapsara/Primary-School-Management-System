const Student = require("../models/Student");
const Parent = require("../models/Parent");
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

exports.getStudents = (req, res) => {

  const filters = {
    name: req.query.name || null,
    className: req.query.className || null,
    grade: req.query.grade || null,
    gender: req.query.gender || null,
    syllabus: req.query.syllabus || null
  };

  // Check and add filters based on the request query parameters
  if (req.query.name) filters.name = req.query.name;
  if (req.query.className) filters.className = req.query.className;
  if (req.query.grade) filters.grade = req.query.grade;
  if (req.query.gender) filters.gender = req.query.gender;
  if (req.query.syllabus) filters.syllabus = req.query.syllabus;


  Student.getAll(filters, (err, results) => {
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
      fullName, nameWithInitials, email, gender, religion, dob, address, contactNumber, grade, syllabus, vaccination,
      onAnyDrugs, allergies, sistersBrothersInSameSchool, enrollmentDate, documents, password, adminID, username,
      fatherName, fatherContact, fatherNIC, fatherAddress, fatherOccupation,
      motherName, motherContact, motherNIC, motherAddress, motherOccupation, className, academicYear // New fields for class
    } = req.body;

    console.log("Received student data:", req.body); // Debugging

    const profilePhotoPath = req.file ? req.file.path : null; // Get uploaded file path

    // Hash the password using bcrypt
    bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Error processing password" });
      }

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

        // Handle dynamic Class generation based on grade
        const generateClassName = (grade) => {
          const classes = [];
          for (let i = 1; i <= 3; i++) { // Assuming 3 classes per grade
            classes.push(`${grade}${String.fromCharCode(64 + i)}`); // 65 -> A, 66 -> B, etc.
          }
          return classes;
        };

        // Get class name based on grade (e.g., "1A", "1B")
        const classNames = generateClassName(grade);

        if (!classNames.includes(className)) {
          return res.status(400).json({ error: `Invalid class name for grade ${grade}` });
        }

        // Insert Student
        const studentData = {
          Full_name: fullName, Name_with_initials: nameWithInitials, Email: email, Gender: gender, Religion: religion,
          Date_of_birth: dob, Address: address, Contact_number: contactNumber, Grade: grade, Syllabus: syllabus, Immunization: vaccination,
          On_any_drugs: onAnyDrugs, Allergies: allergies, Sisters_brothers_in_same_school: sistersBrothersInSameSchool,
          Joined_date: enrollmentDate, Documents: documents, password: hashedPassword, Admin_ID: adminID, Parent_ID: parentID, username: username,
          Profile_photo: profilePhotoPath, // Store image path in database
          Class_name: className, Academic_year: academicYear // Pass Class details
        };

        // Insert student into the database
        Student.create(studentData, (err, studentResult) => {
          if (err) {
            console.error("Error adding student:", err);
            return res.status(500).json({ error: "Error adding student" });
          }

          // Insert into StudentClass table to link student to class
          const studentClassData = {
            Student_ID: studentResult.insertId,
            Class_name: className,
            Academic_year: academicYear
          };

          Student.addStudentToClass(studentClassData, (err, studentClassResult) => {
            if (err) {
              console.error("Error adding student to class:", err);
              return res.status(500).json({ error: "Error adding student to class" });
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
    });
  });
};
