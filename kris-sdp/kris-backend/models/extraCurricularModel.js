const db = require("../config/db");

const getAllActivities = (callback) => {
  const query = "SELECT Activity_name AS name, Activity_emoji AS img FROM ExtraCurricularActivity";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Add a new activity
const addActivity = (activity, callback) => {
  const query = `
    INSERT INTO ExtraCurricularActivity 
    (Activity_name, Activity_emoji, Description, Teacher_incharge, Location) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const { name, img, description, teacher_incharge, location } = activity;

  db.query(query, [name, img, description, teacher_incharge, location], (err, result) => {
    if (err) return callback(err, null);
    callback(null, { id: result.insertId, ...activity });
  });
};

module.exports = { getAllActivities, addActivity };
