const pool = require("../config/db");

  // Get all teachers with their class names
  const Teacher = {
    getAll: (filters, callback) => {
      let sql = `
        SELECT 
          Teacher.Full_name, 
          Teacher.Name_with_initials, 
          Teacher.Age, 
          Teacher.Contact_number, 
          Teacher.Email, 
          Teacher.NIC, 
          Teacher.Previous_schools, 
          Teacher.Documents, 
          Teacher.Joined_date, 
          Teacher.Leaving_date, 
          Teacher.Status,  
          Teacher.role, 
          Teacher.Profile_photo, 
          Teacher.Gender, 
          Teacher.Address,
          Teacher.Grade,  
          Class.Class_name
        FROM Teacher
        INNER JOIN TeacherClass ON Teacher.Teacher_ID = TeacherClass.Teacher_ID
        INNER JOIN Class ON TeacherClass.Class_ID = Class.Class_ID
        WHERE 1=1
      `;
  
      const values = [];
  
      if (filters.name) {
        sql += ` AND Teacher.Full_name LIKE ?`;
        values.push(`%${filters.name}%`);
      }
  
      if (filters.className) {
        sql += ` AND Class.Class_name = ?`;
        values.push(filters.className);
      }
  
      if (filters.grade) {
        sql += ` AND Class.Grade = ?`;  // Fixed column name reference
        values.push(filters.grade);
      }
  
      if (filters.gender) {
        sql += ` AND Teacher.Gender = ?`;
        values.push(filters.gender);
      }
  
      // Now, pass the dynamically built SQL query and values
      pool.query(sql, values, callback);
    },
  

  create: (teacherData, callback) => {
    
    const {
       Full_name, Name_with_initials, Age, Contact_number, Email, NIC, Previous_schools, Documents, Joined_date, Leaving_date, 
       Status,  password, username, role, Profile_photo, Gender, Address, Grade, Class_name, Academic_year 
      } = teacherData;
    
    
    
    const sql = `INSERT INTO Teacher (
       Full_name, Name_with_initials, Age, Contact_number, Email, NIC, Previous_schools, Documents, Joined_date, Leaving_date, 
       Status,  password, username, role, Profile_photo, Gender, Address, Grade     
        
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            Full_name, Name_with_initials, Age, Contact_number, Email, 
            NIC, Previous_schools, Documents, Joined_date, Leaving_date, 
           Status, password, username, role, Profile_photo, Gender,
           Address, Grade  
      
         
    ];

    pool.query(sql, values, (err, result) => {
      if (err) return callback(err, null);

      const teacherID = result.insertId; // Get the new Teacher_ID

      // Step 2: Retrieve Class_ID from Class_name
      const classQuery = "SELECT Class_ID FROM Class WHERE Class_name = ?";
      pool.query(classQuery, [Class_name], (err, classResults) => {
        if (err) return callback(err, null);
        if (classResults.length === 0) return callback({ error: "Class not found" }, null);

        const classID = classResults[0].Class_ID;

        // Step 3: Insert into TeacherClass table
        Teacher.addTeacherToClass({ Teacher_ID: teacherID, Class_ID: classID, Academic_year }, (err) => {
          if (err) return callback(err, null);

          callback(null, { message: "Teacher added successfully", teacherID, classID, Academic_year });
        });
      });
    });
  },

  // Add teacher to class
  addTeacherToClass: (teacherClassData, callback) => {
    const sql = `INSERT INTO TeacherClass (Teacher_ID, Class_ID, Academic_year) VALUES (?, ?, ?)`;
    pool.query(sql, [teacherClassData.Teacher_ID, teacherClassData.Class_ID, teacherClassData.Academic_year], callback);
  }
};

module.exports = Teacher;
       