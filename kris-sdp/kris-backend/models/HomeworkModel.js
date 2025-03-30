const db = require("../config/db");

const HomeworkModel = {
  getAllHomework: (callback) => {
    db.query("SELECT * FROM Homework", callback);
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

  getUpcomingHomework: (callback) => {
    const sql = "SELECT * FROM Homework WHERE Due_date >= CURDATE() AND Due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
    db.query(sql, callback);
  },

  getRecentHomework: (callback) => {
    const sql = "SELECT * FROM Homework WHERE Due_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    db.query(sql, callback);
  }
};

module.exports = HomeworkModel;