const pool = require("../config/db");

const Student = {
  // Get all students with their class names
  getAll: (filters, callback) => {
    const sql = `
      SELECT 
    Student.Student_ID, 
    Student.Full_name, 
    Student.Name_with_initials, 
    Student.Email, 
    Student.Gender, 
    Student.Religion, 
    Student.Date_of_birth, 
    Student.Address, 
    Student.Contact_number, 
    Student.Grade, 
    Student.Syllabus, 
    Student.Immunization, 
    Student.On_any_drugs, 
    Student.Allergies, 
    Student.Sisters_brothers_in_same_school, 
    Student.Joined_date, 
    Student.Documents, 
    Student.Profile_photo, 
    Student.Status,
    Student.monthly_amount,
    Student.Parent_ID,
    Class.Class_name,
    StudentClass.Academic_year,
    Parent.Father_name,
    Parent.Father_contact,
    Parent.Father_NIC,
    Parent.Father_address,
    Parent.Father_occupation,
    Parent.Mother_name,
    Parent.Mother_contact,
    Parent.Mother_NIC,
    Parent.Mother_address,
    Parent.Mother_occupation

FROM Student

INNER JOIN Parent ON Student.Parent_ID = Parent.Parent_ID

INNER JOIN (
    SELECT Student_ID, MAX(Academic_year) AS LatestYear
    FROM StudentClass
    GROUP BY Student_ID
) latest ON Student.Student_ID = latest.Student_ID

INNER JOIN StudentClass ON StudentClass.Student_ID = latest.Student_ID AND StudentClass.Academic_year = latest.LatestYear

INNER JOIN Class ON StudentClass.Class_ID = Class.Class_ID

WHERE 1=1`;

    const values = [];

    // Add filters to the query
    if (filters.name) {
      sql += ` AND Student.Full_name LIKE ?`;
      values.push(`%${filters.name}%`);
    }

    if (filters.className) {
      sql += ` AND Class.Class_name = ?`;
      values.push(filters.className);
    }

    if (filters.grade) {
      sql += ` AND Student.Grade = ?`;
      values.push(filters.grade);
    }

    if (filters.gender) {
      sql += ` AND Student.Gender = ?`;
      values.push(filters.gender);
    }

    if (filters.syllabus) {
      sql += ` AND Student.Syllabus = ?`;
      values.push(filters.syllabus);
    }

    if (filters.academicYear) {
      sql += ` AND StudentClass.Academic_year = ?`;
      values.push(filters.academicYear);
    }

    pool.query(sql, callback);
  },

  create: (studentData, callback) => {
    const {
      Full_name,
      Name_with_initials,
      Email,
      Gender,
      Religion,
      Date_of_birth,
      Address,
      Contact_number,
      Grade,
      Syllabus,
      Immunization,
      On_any_drugs,
      Allergies,
      Sisters_brothers_in_same_school,
      Joined_date,
      Documents,
      password,
      Admin_ID,
      monthly_amount,
      Parent_ID,
      username,
      Profile_photo,
      Class_name,
      Academic_year,
    } = studentData;

    // Step 1: Insert student into Student table
    const sql = `INSERT INTO Student (
      Full_name, Name_with_initials, Email, Gender, Religion, Date_of_birth, Address, Contact_number, Grade,
      Syllabus, Immunization, On_any_drugs, Allergies, Sisters_brothers_in_same_school, Joined_date, 
      Documents, password, Admin_ID, monthly_amount, Parent_ID, username, Profile_photo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      Full_name,
      Name_with_initials,
      Email,
      Gender,
      Religion,
      Date_of_birth,
      Address,
      Contact_number,
      Grade,
      Syllabus,
      Immunization,
      On_any_drugs,
      Allergies,
      Sisters_brothers_in_same_school,
      Joined_date,
      Documents,
      password,
      Admin_ID,
      monthly_amount,
      Parent_ID,
      username,
      Profile_photo,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) return callback(err, null);

      const studentID = result.insertId; // Get the new Student_ID

      // Step 2: Retrieve Class_ID from Class_name
      const classQuery = "SELECT Class_ID FROM Class WHERE Class_name = ?";
      pool.query(classQuery, [Class_name], (err, classResults) => {
        if (err) return callback(err, null);
        if (classResults.length === 0)
          return callback({ error: "Class not found" }, null);

        const classID = classResults[0].Class_ID;

        // Step 3: Insert into StudentClass table
        Student.addStudentToClass(
          { Student_ID: studentID, Class_ID: classID, Academic_year },
          (err) => {
            if (err) return callback(err, null);

            callback(null, {
              message: "Student added successfully",
              studentID,
              classID,
              Academic_year,
            });
          }
        );
      });
    });
  },

  // Add student to class
  addStudentToClass: (studentClassData, callback) => {
    const sql = `INSERT INTO StudentClass (Student_ID, Class_ID, Academic_year) VALUES (?, ?, ?)`;
    pool.query(
      sql,
      [
        studentClassData.Student_ID,
        studentClassData.Class_ID,
        studentClassData.Academic_year,
      ],
      callback
    );
  },

  // Get students by class ID
  getStudentsByClass: (classID, callback) => {
    const sql = `
      SELECT s.*
      FROM Student s
      INNER JOIN StudentClass sc ON s.Student_ID = sc.Student_ID
      WHERE sc.Class_ID = ? AND s.Status = 'active'
    `;
    pool.query(sql, [classID], callback);
  },

  // ✅ Update student status
  updateStatus: (studentId, status, callback) => {
    const query = "UPDATE Student SET Status = ? WHERE Student_ID = ?";
    pool.query(query, [status, studentId], callback);
  },

  // ✅ Update student details
  update: (studentId, studentData, callback) => {
    const sql = `
    UPDATE Student SET
      Full_name = ?, 
      Date_of_birth = ?, 
      Address = ?, 
      Contact_number = ?, 
      Email = ?, 
      Syllabus = ?, 
      Immunization = ?, 
      Sisters_brothers_in_same_school = ?, 
      Joined_date = ?,
      On_any_drugs = ?,
      monthly_amount = ?,
      Documents = ?
    WHERE Student_ID = ?
  `;

    const values = [
      studentData.Full_name,
      studentData.Date_of_birth,
      studentData.Address,
      studentData.Contact_number,
      studentData.Email,
      studentData.Syllabus,
      studentData.Immunization,
      studentData.Sisters_brothers_in_same_school,
      studentData.Joined_date,
      studentData.On_any_drugs,
      studentData.monthly_amount,
      studentData.Documents,
      studentId,
    ];

    console.log("Values:", studentData);

    pool.query(sql, values, callback);
  },

  changePassword: (studentId, password, callback) => {
    console.log("Changing password for student ID:", studentId);
    console.log("New password:", password);
    const sql = `UPDATE Student SET password = ? WHERE Student_ID = ?`;
    pool.query(sql, [password, studentId], callback);
  },
};

module.exports = Student;
