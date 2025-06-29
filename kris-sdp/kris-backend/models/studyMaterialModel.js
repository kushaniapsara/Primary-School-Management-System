const pool = require('../config/db'); 

// Insert new study material into the database
const addStudyMaterial = (materialId, title, description, classId, fileType, filePath, callback) => {
  const query = `
    INSERT INTO StudyMaterial (Material_ID, Title, Description, Class_ID, File_Type, File_Path) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  pool.query(query, [materialId, title, description, classId, fileType, filePath], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err); // ✅ Log database errors
      return callback(err, null);
    }
    callback(null, result);
  });
};


// Get study materials by category
const getStudyMaterialsByCategory = (category, callback) => {
  const query = 'SELECT * FROM StudyMaterial WHERE File_Type = ?';
  pool.query(query, [category], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {addStudyMaterial, getStudyMaterialsByCategory};
