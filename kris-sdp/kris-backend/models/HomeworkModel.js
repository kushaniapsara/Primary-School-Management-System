const db = require("../config/db");

const HomeworkModel = {
  getAllHomework: (callback) => {
    const query = "SELECT * FROM Homework";
    db.query(query, callback);
  },

  addHomework: (homework, callback) => {
    const query = "INSERT INTO Homework (Homework_task, Due_date, Class_ID) VALUES (?, ?, ?)";
    db.query(query, [homework.Homework_task, homework.Due_date, homework.Class_ID], callback);
  },

  updateHomework: (id, homework, callback) => {
    const query = "UPDATE Homework SET Homework = ?, Due_date = ?, Class_ID = ? WHERE Homework_ID = ?";
    db.query(query, [homework.Homework_task, homework.Due_date, homework.Class_ID, id], callback);
  },

  deleteHomework: (id, callback) => {
    const query = "DELETE FROM Homework WHERE Homework_ID = ?";
    db.query(query, [id], callback);
  },
};

module.exports = HomeworkModel;