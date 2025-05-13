const express = require('express');
const router = express.Router();
const mealChartController = require('../controllers/mealChartController');

router.get('/', mealChartController.getAllMeals);
router.post('/', mealChartController.addMeal);
router.put('/:id', mealChartController.updateMeal);
router.delete('/:id', mealChartController.deleteMeal);

module.exports = router;
