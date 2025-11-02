const Expense = require("../models/Expenses");

module.exports.addExpense = async function (req, res) {
  try {
    const { description, amount, category, date, paymentMethod } = req.body;

    // Create a new expense with user ID
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      paymentMethod: paymentMethod || "self",
      userId: req.userId, // From auth middleware
    });

    // Save the expense to the database
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
};

module.exports.getExpenses = async function (req, res) {
  try {
    // Only get expenses for the authenticated user
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

module.exports.testGet = async function (req, res) {
  try {
    res.status(200).json({ message: "Test GET endpoint is working!" });
  } catch (error) {
    res.status(500).json({ error: "Error on test GET endpoint" });
  }
};
