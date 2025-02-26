const pool = require("../config/db");

const Parent = {
  getAll: (callback) => {
    pool.query("SELECT * FROM Parent", callback);
  },

  create: (parentData, callback) => {
    const sql = `INSERT INTO Parent 
      (Father_name, Father_contact, Father_NIC, Father_address, Father_occupation, 
       Mother_name, Mother_contact, Mother_NIC, Mother_address, Mother_occupation) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      parentData.Father_name, parentData.Father_contact, parentData.Father_NIC,
      parentData.Father_address, parentData.Father_occupation,
      parentData.Mother_name, parentData.Mother_contact, parentData.Mother_NIC,
      parentData.Mother_address, parentData.Mother_occupation
    ];

    pool.query(sql, values, callback);
  }
};

module.exports = Parent;
