const pool = require("../config/db");

const Student = {
  getAll: (callback) => {
    pool.query("SELECT * FROM Student", callback);
  },

  create: (studentData, callback) => {
    const sql = `INSERT INTO Student (
       Full_name, Name_with_initials, Email, Gender, Religion, Date_of_birth, Address, Contact_number, Grade,
                Syllabus, Immunization, On_any_drugs, Allergies, Sisters_brothers_in_same_school, Joined_date, 
                Documents, password, Admin_ID, Parent_ID, username, Profile_photo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            studentData.Full_name, studentData.Name_with_initials, studentData.Email, studentData.Gender, 
            studentData.Religion, studentData.Date_of_birth, studentData.Address, studentData.Contact_number, 
            studentData.Grade, studentData.Syllabus, studentData.Immunization, studentData.On_any_drugs, studentData.Allergies, 
            studentData.Sisters_brothers_in_same_school, studentData.Joined_date, studentData.Documents, 
            studentData.password, studentData.Admin_ID, studentData.Parent_ID, studentData.username, studentData.Profile_photo
        ];

    pool.query(sql, values, callback);
  }
};

module.exports = Student;
