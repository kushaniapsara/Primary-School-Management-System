const extraCurricularPageModel = require('../models/extraCurricularPageModel');

const getStudentEnrolledActivities = (req, res) => {
  const { studentId } = req.params;

  extraCurricularPageModel.getEnrolledActivitiesByStudentId(studentId, (err, results) => {
    if (err) {
      console.error("Error fetching enrolled activities:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

const updateAward = (req, res) => {
    const { studentId, activityId } = req.params;
    const { award } = req.body;
  
    extraCurricularPageModel.updateAwardForStudentActivity(studentId, activityId, award, (err, results) => {
      if (err) {
        console.error("Error updating award:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ message: "Award updated successfully" });
    });
  };
  

module.exports = {
  getStudentEnrolledActivities, updateAward,
};
