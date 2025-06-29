const Student = require("../models/Student");
const Parent = require("../models/Parent");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // Number of salt rounds for hashing
const pool = require("../config/db");

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
    syllabus: req.query.syllabus || null,
    academicYear: req.query.academicYear || null,
  };

  // Check and add filters based on the request query parameters
  if (req.query.name) filters.name = req.query.name;
  if (req.query.className) filters.className = req.query.className;
  if (req.query.grade) filters.grade = req.query.grade;
  if (req.query.gender) filters.gender = req.query.gender;
  if (req.query.syllabus) filters.syllabus = req.query.syllabus;
  if (req.query.academicYear) filters.academicYear = req.query.academicYear;

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
      fullName,
      nameWithInitials,
      email,
      gender,
      religion,
      dob,
      address,
      contactNumber,
      grade,
      syllabus,
      vaccination,
      onAnyDrugs,
      allergies,
      sistersBrothersInSameSchool,
      enrollmentDate,
      documents,
      password,
      adminID,
      monthly_amount,
      username,
      fatherName,
      fatherContact,
      fatherNIC,
      fatherAddress,
      fatherOccupation,
      motherName,
      motherContact,
      motherNIC,
      motherAddress,
      motherOccupation,
      className,
      academicYear, // New fields for class
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
        Father_name: fatherName,
        Father_contact: fatherContact,
        Father_NIC: fatherNIC,
        Father_address: fatherAddress,
        Father_occupation: fatherOccupation,
        Mother_name: motherName,
        Mother_contact: motherContact,
        Mother_NIC: motherNIC,
        Mother_address: motherAddress,
        Mother_occupation: motherOccupation,
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
          for (let i = 1; i <= 3; i++) {
            // Assuming 3 classes per grade
            classes.push(`${grade}${String.fromCharCode(64 + i)}`); // 65 -> A, 66 -> B, etc.
          }
          return classes;
        };

        // Get class name based on grade (e.g., "1A", "1B")
        const classNames = generateClassName(grade);

        if (!classNames.includes(className)) {
          return res
            .status(400)
            .json({ error: `Invalid class name for grade ${grade}` });
        }

        // Insert Student
        const studentData = {
          Full_name: fullName,
          Name_with_initials: nameWithInitials,
          Email: email,
          Gender: gender,
          Religion: religion,
          Date_of_birth: dob,
          Address: address,
          Contact_number: contactNumber,
          Grade: grade,
          Syllabus: syllabus,
          Immunization: vaccination,
          On_any_drugs: onAnyDrugs,
          Allergies: allergies,
          Sisters_brothers_in_same_school: sistersBrothersInSameSchool,
          Joined_date: enrollmentDate,
          Documents: documents,
          password: hashedPassword,
          Admin_ID: adminID,
          monthly_amount: monthly_amount,
          Parent_ID: parentID,
          username: username,
          Profile_photo: profilePhotoPath, // Store image path in database
          Class_name: className,
          Academic_year: academicYear, // Pass Class details
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
            Academic_year: academicYear,
          };

          Student.addStudentToClass(
            studentClassData,
            (err, studentClassResult) => {
              if (err) {
                console.error("Error adding student to class:", err);
                return res
                  .status(500)
                  .json({ error: "Error adding student to class" });
              }

              console.log("Student added with ID:", studentResult.insertId);
              res.json({
                message: "Student added successfully",
                studentID: studentResult.insertId,
                parentID: parentID,
                profilePhoto: profilePhotoPath,
              });
            }
          );
        });
      });
    });
  });
};

// New function for class-specific student list for teacher
exports.getStudentsByClass = (req, res) => {
  const classID = req.classID;

  if (!classID) {
    return res.status(403).json({ error: "Class ID missing in token" });
  }

  Student.getStudentsByClass(classID, (err, results) => {
    if (err) {
      console.error("Error fetching students by class:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

exports.promoteStudents = (req, res) => {
  const { studentIds, newClassName, newYear } = req.body;

  if (!studentIds?.length || !newClassName || !newYear) {
    return res.status(400).json({ message: "Missing data" });
  }

  const sqlClassID = `SELECT Class_ID FROM Class WHERE Class_name = ?`;

  pool.query(sqlClassID, [newClassName], (err, classResult) => {
    if (err) {
      console.error("Error retrieving class ID:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (!classResult.length) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newClassId = classResult[0].Class_ID;

    // Prepare insert values for bulk insert
    const values = studentIds.map((id) => [id, newClassId, newYear]);
    console.log("Values to insert:", values); // ✅ Add this

    const sqlInsert = `
      INSERT INTO StudentClass (Student_ID, Class_ID, Academic_year)
      VALUES ?
    `;

    pool.query(sqlInsert, [values], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Failed to promote students", error: err });
      }

      console.log("Insert result:", result); // ✅ Add this
      res.json({ message: "Students promoted successfully" });
    });
  });
};

exports.updateStudentStatus = (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  Student.updateStatus(studentId, status, (err, result) => {
    if (err) {
      console.error("Controller Error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  });
};

exports.updateStudentInfo = (req, res) => {
  const studentId = req.params.id;
  const {
    Full_name,
    Date_of_birth,
    Address,
    Contact_number,
    Email,
    Syllabus,
    Immunization,
    On_any_drugs,
    Sisters_brothers_in_same_school,
    Joined_date,
    monthly_amount,
    Documents,
  } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const updatedData = {
    Full_name: Full_name,
    Date_of_birth: Date_of_birth,
    Address: Address,
    Contact_number: Contact_number,
    Email: Email,
    Syllabus: Syllabus,
    Immunization: Immunization,
    On_any_drugs: On_any_drugs,
    Sisters_brothers_in_same_school: Sisters_brothers_in_same_school,
    Joined_date: Joined_date,
    monthly_amount: monthly_amount,
    Documents: Documents,
  };

  Student.update(studentId, updatedData, (err, _result) => {
    if (err) {
      console.error("Error updating student:", err);
      return res.status(500).json({ message: "Failed to update student" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  });
};

exports.changeStudentPassword = (req, res) => {
  const studentId = req.params.id;
  const { newPw } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  // Hash the new password
  bcrypt.hash(newPw, SALT_ROUNDS, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error processing password" });
    }

    Student.changePassword(studentId, hashedPassword, (err, _result) => {
      if (err) {
        console.error("Error updating student password:", err);
        return res.status(500).json({ message: "Failed to update password" });
      }

      res.status(200).json({ message: "Password updated successfully" });
    });
  });
};
