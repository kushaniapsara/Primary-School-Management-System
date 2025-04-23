const db = require("../config/db");

const HomeworkModel = {
  // Get all homework for a specific class
  getAllHomeworkByClass: (classId, callback) => {
    const sql = "SELECT * FROM Homework WHERE Class_ID = ?";
    db.query(sql, [classId], callback);
  },


  addHomework: (homework, callback) => {
    const sql = "INSERT INTO Homework (Homework_task, Due_date, Class_ID) VALUES (?, ?, ?)";
    db.query(sql, [homework.Homework_task, homework.Due_date, homework.Class_ID], callback);
  },

  updateHomework: (id, homework, callback) => {
    const sql = "UPDATE Homework SET Homework_task = ?, Due_date = ?, Class_ID = ? WHERE Homework_ID = ?";
    db.query(sql, [homework.Homework_task, homework.Due_date, homework.Class_ID, id], callback);
  },

  deleteHomework: (id, callback) => {
    db.query("DELETE FROM Homework WHERE Homework_ID = ?", [id], callback);
  },

  getUpcomingHomeworkByClass: (classId, callback) => {
    const sql = "SELECT * FROM Homework WHERE Class_ID = ? AND Due_date >= CURDATE() AND Due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
    db.query(sql, [classId], callback);
  },

  getRecentHomework: (classId, callback) => {
    const sql = "SELECT * FROM Homework WHERE Class_ID = ? AND Due_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    db.query(sql, [classId], callback);
  }
};

module.exports = HomeworkModel;