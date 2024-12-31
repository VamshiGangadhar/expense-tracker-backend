const express = require('express');
const addExpensesController = require('../controllers/addExpenseController');
const router = express.Router();

router.post('/add_expense', addExpensesController.addExpense);

router.get('/get_expenses', addExpensesController.getExpenses);

router.get('/test', addExpensesController.testGet);

module.exports = router;