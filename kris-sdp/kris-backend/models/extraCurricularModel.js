const db = require("../config/db");

const getAllActivities = (callback) => {
  const query = "SELECT Activity_name AS name, Activity_emoji AS img FROM ExtraCurricularActivity";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const addActivity = (activity, callback) => {
  const query = "INSERT INTO ExtraCurricularActivity (Activity_name, Activity_emoji) VALUES (?, ?)";
  db.query(query, [activity.name, activity.img], (err, result) => {
    if (err) return callback(err, null);
    callback(null, { id: result.insertId, ...activity });
  });
};

module.exports = { getAllActivities, addActivity };
