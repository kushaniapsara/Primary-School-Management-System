const pool = require("../config/db");

const Teacher = {
  getAll: (callback) => {
    pool.query("SELECT * FROM Teacher", callback);
  },

  create: (teacherData, callback) => {
    const sql = `INSERT INTO Teacher (
       Full_name, Name_with_initials, Age, Contact_number, Email, NIC, Previous_schools, Documents, Joined_date, Leaving_date, 
       Status,  password, username, role, Profile_photo, Gender, Address     
        
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            teacherData.Full_name, teacherData.Name_with_initials, teacherData.Age, teacherData.Contact_number, teacherData.Email, 
            teacherData.NIC, teacherData.Previous_schools, teacherData.Documents, teacherData.Joined_date, teacherData.Leaving_date, 
            teacherData.Status, teacherData.password, teacherData.username, teacherData.role, teacherData.Profile_photo, teacherData.Gender,
       teacherData.Address  
      
         
    ];

    pool.query(sql, values, callback);
  }
};

module.exports = Teacher;
       