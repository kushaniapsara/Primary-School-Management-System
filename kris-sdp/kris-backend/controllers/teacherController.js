const Teacher = require("../models/Teacher");
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

exports.getTeachers = (req, res) => {
  const filters = {
    name: req.query.name || null,
    className: req.query.className || null,
    grade: req.query.grade || null,
    gender: req.query.gender || null,
  };

  Teacher.getAll(filters, (err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err);
      return res.status(500).json({ error: "Error fetching teachers" });
    }
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
      fullName,
      nameWithInitials,
      email,
      gender,
      age,
      address,
      contactNumber,
      status,
      enrollmentDate,
      documents,
      password,
      username,
      nic,
      previousSchools,
      //leavingDate,
      role,
      grade,
      className,
      academicYear,
    } = req.body;

    console.log("Received teacher data:", req.body); // Debugging

    const profilePhotoPath = req.file ? req.file.path : null; // Get uploaded file path

    // Hash the password using callbacks
    bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Error processing password" });
      }

      // Handle dynamic Class generation based on grade
      const generateClassName = (grade) => {
        const classes = [];
        for (let i = 1; i <= 3; i++) {
          // 3 classes per grade
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

      // Insert Teacher
      const teacherData = {
        Full_name: fullName,
        Name_with_initials: nameWithInitials,
        Age: age,
        Contact_number: contactNumber,
        Email: email,
        NIC: nic,
        Previous_Schools: previousSchools,
        Documents: documents,
        Joined_date: enrollmentDate,
        //Leaving_date: leavingDate,
        Status: status,
        password: hashedPassword,
        username: username,
        role: role,
        Gender: gender,
        Address: address,
        Grade: grade,
        Class_name: className,
        Academic_year: academicYear,

        Profile_photo: profilePhotoPath, // Store image path in database
      };

      Teacher.create(teacherData, (err, teacherResult) => {
        if (err) {
          console.error("Error adding teacher:", err);
          return res.status(500).json({ error: "Error adding teacher" });
        }

        // Insert into TeacherClass table to link teacher to class
        const teacherClassData = {
          Teacher_ID: teacherResult.insertId,
          Class_name: className,
          Academic_year: academicYear,
        };

        Teacher.addTeacherToClass(
          teacherClassData,
          (err, teacherClassResult) => {
            if (err) {
              console.error("Error adding teacher to class:", err);
              return res
                .status(500)
                .json({ error: "Error adding teacher to class" });
            }

            console.log("Teacher added with ID:", teacherResult.insertId);
            res.json({
              message: "Teacher added successfully",
              teacherID: teacherResult.insertId,
              profilePhoto: profilePhotoPath,
            });
          }
        );
      });
    });
  });
};

exports.promoteTeachers = (req, res) => {
  const { teacherIds, newClassName, newYear } = req.body;

  if (!teacherIds?.length || !newClassName || !newYear) {
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
    const values = teacherIds.map((id) => [id, newClassId, newYear]);
    console.log("Values to insert:", values); // ✅ Add this

    const sqlInsert = `
      INSERT INTO TeacherClass (Teacher_ID, Class_ID, Academic_year)
      VALUES ?
    `;

    pool.query(sqlInsert, [values], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Failed to promote teachers", error: err });
      }

      console.log("Insert result:", result); // ✅ Add this
      res.json({ message: "Teachers promoted successfully" });
    });
  });
};

exports.updateTeacherStatus = (req, res) => {
  const teacherId = req.params.id;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  Teacher.updateStatus(teacherId, status, (err, result) => {
    if (err) {
      console.error("Controller Error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  });
};

exports.updateTeacherDetails = (req, res) => {
  const teacherId = req.params.id;

  const teacherData = {
    Full_name: req.body.Full_name,
    Name_with_initials: req.body.Name_with_initials,
    Age: req.body.Age,
    Contact_number: req.body.Contact_number,
    Email: req.body.Email,
    Address: req.body.Address,
    Documents: req.body.Documents,
  };

  Teacher.updateDetails(teacherId, teacherData, (err, result) => {
    if (err) {
      console.error("Error updating teacher details:", err);
      return res.status(500).json({ error: "Error updating teacher details" });
    }

    res.json({ message: "Teacher details updated successfully" });
  });
};

exports.changeTeacherPassword = (req, res) => {
  const teacherId = req.params.id;
  const { newPw } = req.body;

  if (!teacherId) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  // Hash the new password
  bcrypt.hash(newPw, SALT_ROUNDS, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error processing password" });
    }

    Teacher.changePassword(teacherId, hashedPassword, (err, _result) => {
      if (err) {
        console.error("Error updating teacher password:", err);
        return res.status(500).json({ message: "Failed to update password" });
      }

      res.status(200).json({ message: "Password updated successfully" });
    });
  });
};
