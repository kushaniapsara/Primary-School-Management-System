const db = require('../config/db');

const MealChart = {
  getAll: (callback) => {
    db.query('SELECT * FROM MealChart ORDER BY id ASC', callback);
  },
  add: (day, meal, callback) => {
    db.query('INSERT INTO MealChart (day, meal) VALUES (?, ?)', [day, meal], callback);
  },
  update: (id, meal, callback) => {
    db.query('UPDATE MealChart SET meal = ? WHERE id = ?', [meal, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM MealChart WHERE id = ?', [id], callback);
  }
};

module.exports = MealChart;
