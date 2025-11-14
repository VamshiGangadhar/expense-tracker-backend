const mongoose = require("mongoose");

// Define the schema for individual EMI installments
const emiInstallmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidDate: { type: Date, default: null },
  paidAmount: { type: Number, default: 0 },
});

// Define the main EMI schema
const emiSchema = new mongoose.Schema(
  {
    loanName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    totalMonths: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    interestRate: { type: Number, default: 0 },
    lenderName: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    installments: [emiInstallmentSchema],
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
const EMI = mongoose.model("EMI", emiSchema);

module.exports = EMI;
