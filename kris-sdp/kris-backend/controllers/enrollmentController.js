const db = require('../config/db');

// Enroll a student in an extra-curricular activity
exports.enrollInActivity = (req, res) => {
  try {
    const studentID = req.userID;
    const activityID = req.body.activityID;

    console.log("Received Activity ID:", activityID);

    if (!activityID) {
      return res.status(400).json({ message: "Activity ID is required" });
    }

      // Check if the student is already enrolled in this activity
    const checkEnrollmentQuery = `SELECT * FROM StudentExtraCurricularActivity 
                                  WHERE Student_ID = ? AND Activity_ID = ?`;

    db.query(checkEnrollmentQuery, [studentID, activityID], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: 'Database error' });
      }

            // If the student is already enrolled, send a success response with the message
      if (results.length > 0) {
        return res.status(200).json({ message: 'Already enrolled!' }); // Send this response
      }

            // If not enrolled, proceed with enrollment
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const enrollQuery = `INSERT INTO StudentExtraCurricularActivity (Student_ID, Activity_ID, Status, Enrollment_Date)
                           VALUES (?, ?, 'active', ?)`;

      db.query(enrollQuery, [studentID, activityID, currentDate], (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: 'Failed to enroll student.' });
        }

                // Update the student count in ExtraCurricularActivity table(now only from the frontend)
        const updateCountQuery = `UPDATE ExtraCurricularActivity 
                                  SET Student_count = Student_count + 1 
                                  WHERE Activity_ID = ?`;

        db.query(updateCountQuery, [activityID], (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: 'Failed to update student count.' });
          }
          
          // Successfully enrolled, send success response
          res.status(200).json({ message: 'Student successfully enrolled.' });
        });
      });
    });
  } catch (error) {
    console.error("Error during enrollment:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


