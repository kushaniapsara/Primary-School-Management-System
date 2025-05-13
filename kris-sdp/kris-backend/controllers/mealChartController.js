const MealChart = require('../models/MealChartModel');

exports.getAllMeals = (req, res) => {
  MealChart.getAll((err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json(results);
  });
};

exports.addMeal = (req, res) => {
  const { day, meal } = req.body;
  MealChart.add(day, meal, (err, result) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.status(201).json({ message: "Meal added" });
  });
};

exports.updateMeal = (req, res) => {
  const { id } = req.params;
  const { meal } = req.body;
  MealChart.update(id, meal, (err, result) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ message: "Meal updated" });
  });
};

exports.deleteMeal = (req, res) => {
  const { id } = req.params;
  MealChart.delete(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ message: "Meal deleted" });
  });
};
