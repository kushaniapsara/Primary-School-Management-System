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
        Class.Class_name
      FROM Student
      INNER JOIN StudentClass ON Student.Student_ID = StudentClass.Student_ID
      INNER JOIN Class ON StudentClass.Class_ID = Class.Class_ID
      WHERE 1=1;
    `;


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
  


    pool.query(sql, callback);
  },

  create: (studentData, callback) => {
    const {
      Full_name, Name_with_initials, Email, Gender, Religion, Date_of_birth, Address, Contact_number, Grade, 
      Syllabus, Immunization, On_any_drugs, Allergies, Sisters_brothers_in_same_school, Joined_date, 
      Documents, password, Admin_ID, Parent_ID, username, Profile_photo, Class_name, Academic_year
    } = studentData;

    // Step 1: Insert student into Student table
    const sql = `INSERT INTO Student (
      Full_name, Name_with_initials, Email, Gender, Religion, Date_of_birth, Address, Contact_number, Grade,
      Syllabus, Immunization, On_any_drugs, Allergies, Sisters_brothers_in_same_school, Joined_date, 
      Documents, password, Admin_ID, Parent_ID, username, Profile_photo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      Full_name, Name_with_initials, Email, Gender, Religion, Date_of_birth, Address, Contact_number, 
      Grade, Syllabus, Immunization, On_any_drugs, Allergies, Sisters_brothers_in_same_school, 
      Joined_date, Documents, password, Admin_ID, Parent_ID, username, Profile_photo
    ];

    pool.query(sql, values, (err, result) => {
      if (err) return callback(err, null);

      const studentID = result.insertId; // Get the new Student_ID

      // Step 2: Retrieve Class_ID from Class_name
      const classQuery = "SELECT Class_ID FROM Class WHERE Class_name = ?";
      pool.query(classQuery, [Class_name], (err, classResults) => {
        if (err) return callback(err, null);
        if (classResults.length === 0) return callback({ error: "Class not found" }, null);

        const classID = classResults[0].Class_ID;

        // Step 3: Insert into StudentClass table
        Student.addStudentToClass({ Student_ID: studentID, Class_ID: classID, Academic_year }, (err) => {
          if (err) return callback(err, null);

          callback(null, { message: "Student added successfully", studentID, classID, Academic_year });
        });
      });
    });
  },

  // Add student to class
  addStudentToClass: (studentClassData, callback) => {
    const sql = `INSERT INTO StudentClass (Student_ID, Class_ID, Academic_year) VALUES (?, ?, ?)`;
    pool.query(sql, [studentClassData.Student_ID, studentClassData.Class_ID, studentClassData.Academic_year], callback);
  }
};

module.exports = Student;
