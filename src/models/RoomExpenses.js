const mongoose = require("mongoose");

const RoomExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["rent", "utilities", "groceries", "other"],
    default: "other",
  },
  type: {
    type: String,
    enum: ["expense", "income"],
    default: "expense",
  },
  status: {
    type: String,
    enum: ["pending", "settled"],
    default: "pending",
  },
});

module.exports = mongoose.model("RoomExpense", RoomExpenseSchema);
