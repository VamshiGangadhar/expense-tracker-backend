const express = require("express");
const addExpensesController = require("../controllers/addExpenseController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add_expense", auth, addExpensesController.addExpense);

router.get("/get_expenses", auth, addExpensesController.getExpenses);

router.get("/test", addExpensesController.testGet);

module.exports = router;
