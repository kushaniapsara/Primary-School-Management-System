const pool = require("../config/db");

const Admin = {
  getAll: (callback) => {
    pool.query("SELECT * FROM Admin", callback);
  },

  create: (adminData, callback) => {
    const sql = `INSERT INTO Admin (
       Full_name, Name_with_initials, Age, Contact_number, Email, NIC, Previous_schools, Documents, Joined_date, Leaving_date, 
       Status,  password, username, role, Profile_photo, Gender, Address     
        
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            adminData.Full_name, adminData.Name_with_initials, adminData.Age, adminData.Contact_number, adminData.Email, 
            adminData.NIC, adminData.Previous_schools, adminData.Documents, adminData.Joined_date, adminData.Leaving_date, 
            adminData.Status, adminData.password, adminData.username, adminData.role, adminData.Profile_photo, adminData.Gender,
            adminData.Address  
      
         
    ];

    pool.query(sql, values, callback);
  },
  // ✅ Update admin status
updateStatus: (adminId, status, callback) => {
  const query = 'UPDATE Admin SET Status = ? WHERE Admin_ID = ?';
  pool.query(query, [status, adminId], callback);
},

};

module.exports = Admin;
       