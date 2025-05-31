const RoomExpense = require("../models/RoomExpenses");

// Add room expense
exports.addRoomExpense = async (req, res) => {
  try {
    console.log(req.body);
    const { amount, description, type, category = "other" } = req.body;

    const roomExpense = new RoomExpense({
      amount,
      description,
      type,
      category,
    });

    await roomExpense.save();
    res.status(201).json({ success: true, data: roomExpense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all room expenses
exports.getRoomExpenses = async (req, res) => {
  try {
    console.log("req.body");
    const expenses = await RoomExpense.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Calculate balances between roommates
exports.getRoomBalances = async (req, res) => {
  try {
    const expenses = await RoomExpense.find({ status: "pending" });
    const balances = {};

    expenses.forEach((expense) => {
      // Add what the payer has paid
      balances[expense.paidBy] =
        (balances[expense.paidBy] || 0) + expense.amount;

      // Subtract what each person owes
      expense.splitBetween.forEach((split) => {
        balances[split.name] = (balances[split.name] || 0) - split.amount;
      });
    });

    const formattedBalances = Object.entries(balances).map(
      ([name, amount]) => ({
        name,
        amount: parseFloat(amount.toFixed(2)),
      })
    );

    res.status(200).json({ success: true, data: formattedBalances });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mark expense as settled
exports.settleExpense = async (req, res) => {
  try {
    const expense = await RoomExpense.findByIdAndUpdate(
      req.params.id,
      { status: "settled" },
      { new: true }
    );
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete room expense
exports.deleteRoomExpense = async (req, res) => {
  try {
    await RoomExpense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
