const db = require("../config/db");

const noticeModel = {
  getAllNotice: (callback) => {
    db.query("SELECT * FROM SpecialNotice", callback);
  },

  addNotice: (notice, callback) => {
    const sql = "INSERT INTO SpecialNotice (Date, Heading, Description, Admin_ID) VALUES (?, ?, ?, ?)";
    db.query(sql, [notice.Date, notice.Heading, notice.Description, notice.Admin_ID], callback);
  },

  updateNotice: (id, notice, callback) => {
    const sql = "UPDATE SpecialNotice SET Date = ?, Heading = ?, Description = ?, Admin_ID = ? WHERE Notice_ID = ?";
    db.query(sql, [notice.Date, notice.Heading, notice.Description, notice.Admin_ID, id], callback);
  },

  deleteNotice: (id, callback) => {
    db.query("DELETE FROM SpecialNotice WHERE Notice_ID = ?", [id], callback);
  },

};

module.exports = noticeModel;
