const Expense = require("../models/Expenses");
const Repayment = require("../models/Repayments");

// Mark expense as repaid
module.exports.markAsRepaid = async function (req, res) {
  try {
    const { expenseId } = req.params;
    const { repaidAmount, repaymentDate } = req.body;

    console.log("Received repayment request for expenseId:", expenseId);
    console.log("Request body:", req.body);

    // Find the expense
    const expense = await Expense.findById(expenseId);
    console.log("Found expense:", expense);
    
    if (!expense) {
      console.log("Expense not found with ID:", expenseId);
      return res.status(404).json({ error: "Expense not found" });
    }

    // Check if it's lent or credit-card
    console.log("Expense paymentMethod:", expense.paymentMethod);
    
    if (
      expense.paymentMethod !== "lent" &&
      expense.paymentMethod !== "credit-card"
    ) {
      console.log("Invalid payment method for repayment:", expense.paymentMethod);
      return res
        .status(400)
        .json({
          error: "Only lent and credit card expenses can be marked as repaid",
        });
    }

    // Update expense repayment status
    expense.isRepaid = true;
    expense.repaidAmount = repaidAmount || expense.amount;
    await expense.save();

    // Create repayment record
    const repaymentRecordDate = repaymentDate
      ? new Date(repaymentDate)
      : new Date();
    const repaymentRecord = new Repayment({
      expenseId: expense._id,
      repaymentType: expense.paymentMethod,
      originalAmount: expense.amount,
      repaidAmount: repaidAmount || expense.amount,
      repaymentDate: repaymentRecordDate,
      description: expense.description,
      month: repaymentRecordDate.getMonth(),
      year: repaymentRecordDate.getFullYear(),
      isFullyRepaid: (repaidAmount || expense.amount) >= expense.amount,
    });

    await repaymentRecord.save();

    res.status(200).json({
      message: "Expense marked as repaid",
      expense,
      repayment: repaymentRecord,
    });
  } catch (error) {
    console.error("Error marking expense as repaid:", error);
    res.status(500).json({ error: "Error marking expense as repaid" });
  }
};

// Get repayment history
module.exports.getRepayments = async function (req, res) {
  try {
    const { month, year } = req.query;

    let filter = {};
    if (month !== undefined && year !== undefined) {
      filter.month = parseInt(month);
      filter.year = parseInt(year);
    }

    const repayments = await Repayment.find(filter)
      .populate("expenseId")
      .sort({ repaymentDate: -1 });

    res.json(repayments);
  } catch (error) {
    console.error("Error fetching repayments:", error);
    res.status(500).json({ error: "Error fetching repayments" });
  }
};

// Get repayment summary
module.exports.getRepaymentSummary = async function (req, res) {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth =
      month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear =
      year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const repayments = await Repayment.find({
      month: targetMonth,
      year: targetYear,
    });

    const summary = {
      month: targetMonth,
      year: targetYear,
      totalLentRepaid: 0,
      totalCreditCardRepaid: 0,
      lentCount: 0,
      creditCardCount: 0,
      repayments: repayments,
    };

    repayments.forEach((repayment) => {
      if (repayment.repaymentType === "lent") {
        summary.totalLentRepaid += repayment.repaidAmount;
        summary.lentCount++;
      } else if (repayment.repaymentType === "credit-card") {
        summary.totalCreditCardRepaid += repayment.repaidAmount;
        summary.creditCardCount++;
      }
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching repayment summary:", error);
    res.status(500).json({ error: "Error fetching repayment summary" });
  }
};

// Mark expense as not repaid (undo)
module.exports.markAsNotRepaid = async function (req, res) {
  try {
    const { expenseId } = req.params;

    // Find the expense
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update expense repayment status
    expense.isRepaid = false;
    expense.repaidAmount = 0;
    await expense.save();

    // Remove repayment record
    await Repayment.deleteOne({ expenseId: expense._id });

    res.status(200).json({
      message: "Expense marked as not repaid",
      expense,
    });
  } catch (error) {
    console.error("Error marking expense as not repaid:", error);
    res.status(500).json({ error: "Error marking expense as not repaid" });
  }
};
