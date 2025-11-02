const mongoose = require("mongoose");

// Define the schema
const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    paymentMethod: { type: String, default: "self" },
    isRepaid: { type: Boolean, default: false },
    repaidAmount: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const Expense = mongoose.model("expenses", expenseSchema);

module.exports = Expense;
