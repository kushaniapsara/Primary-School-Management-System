const db = require("../config/db");

const getEnrolledActivitiesByStudentId = (studentId, callback) => {
  const query = `
    SELECT 
      eca.Activity_ID, 
      aca.Activity_name, 
      aca.Activity_emoji,
      eca.Awards
    FROM 
      StudentExtraCurricularActivity eca
    JOIN 
      ExtraCurricularActivity aca ON eca.Activity_ID = aca.Activity_ID
    WHERE 
      eca.Student_ID = ? 
      AND eca.Status = 'active'
  `;
  
  db.query(query, [studentId], callback);
};

const updateAwardForStudentActivity = (studentId, activityId, award, callback) => {
    const query = `
      UPDATE StudentExtraCurricularActivity 
      SET Awards = ? 
      WHERE Student_ID = ? AND Activity_ID = ? AND Status = 'active'
    `;
  
    db.query(query, [award, studentId, activityId], callback);
  };

module.exports = {
  getEnrolledActivitiesByStudentId, updateAwardForStudentActivity
};
