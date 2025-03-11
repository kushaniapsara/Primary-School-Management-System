const pool = require('../config/db'); // Ensure the correct database connection is used

// Insert new study material into the database
const addStudyMaterial = (category, filePath, callback) => {
  const query = 'INSERT INTO StudyMaterials (category, file_path) VALUES (?, ?)';
  pool.query(query, [category, filePath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Get study materials by category
const getStudyMaterialsByCategory = (category, callback) => {
  const query = 'SELECT * FROM StudyMaterials WHERE category = ?';
  pool.query(query, [category], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  addStudyMaterial,
  getStudyMaterialsByCategory,
};
