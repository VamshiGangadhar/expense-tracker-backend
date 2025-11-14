const EMI = require("../models/EMI");

// Helper function to calculate monthly due dates
const generateInstallments = (startDate, monthlyAmount, totalMonths) => {
  const installments = [];
  const start = new Date(startDate);

  for (let i = 1; i <= totalMonths; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + (i - 1));

    installments.push({
      installmentNumber: i,
      dueDate: dueDate,
      amount: monthlyAmount,
      isPaid: false,
      paidDate: null,
      paidAmount: 0,
    });
  }

  return installments;
};

// Create new EMI
const createEMI = async (req, res) => {
  try {
    const {
      loanName,
      totalAmount,
      monthlyAmount,
      totalMonths,
      startDate,
      interestRate,
      lenderName,
      description,
    } = req.body;

    const userId = req.user._id;

    // Calculate end date
    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setMonth(start.getMonth() + totalMonths);

    // Generate installments
    const installments = generateInstallments(
      startDate,
      monthlyAmount,
      totalMonths
    );

    const newEMI = new EMI({
      loanName,
      totalAmount,
      monthlyAmount,
      totalMonths,
      startDate,
      endDate,
      interestRate: interestRate || 0,
      lenderName: lenderName || "",
      description: description || "",
      installments,
      userId,
    });

    await newEMI.save();
    res.status(201).json({
      success: true,
      message: "EMI created successfully",
      data: newEMI,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating EMI",
      error: error.message,
    });
  }
};

// Get all EMIs for a user
const getEMIs = async (req, res) => {
  try {
    const userId = req.user._id;
    const emis = await EMI.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: emis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching EMIs",
      error: error.message,
    });
  }
};

// Mark EMI installment as paid
const markInstallmentPaid = async (req, res) => {
  try {
    const { emiId, installmentNumber } = req.params;
    const { paidAmount, paidDate } = req.body;
    const userId = req.user._id;

    const emi = await EMI.findOne({ _id: emiId, userId });
    if (!emi) {
      return res.status(404).json({
        success: false,
        message: "EMI not found",
      });
    }

    const installment = emi.installments.find(
      (inst) => inst.installmentNumber === parseInt(installmentNumber)
    );

    if (!installment) {
      return res.status(404).json({
        success: false,
        message: "Installment not found",
      });
    }

    installment.isPaid = true;
    installment.paidDate = paidDate || new Date();
    installment.paidAmount = paidAmount || installment.amount;

    await emi.save();

    res.status(200).json({
      success: true,
      message: "Installment marked as paid",
      data: emi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking installment as paid",
      error: error.message,
    });
  }
};

// Mark EMI installment as unpaid
const markInstallmentUnpaid = async (req, res) => {
  try {
    const { emiId, installmentNumber } = req.params;
    const userId = req.user._id;

    const emi = await EMI.findOne({ _id: emiId, userId });
    if (!emi) {
      return res.status(404).json({
        success: false,
        message: "EMI not found",
      });
    }

    const installment = emi.installments.find(
      (inst) => inst.installmentNumber === parseInt(installmentNumber)
    );

    if (!installment) {
      return res.status(404).json({
        success: false,
        message: "Installment not found",
      });
    }

    installment.isPaid = false;
    installment.paidDate = null;
    installment.paidAmount = 0;

    await emi.save();

    res.status(200).json({
      success: true,
      message: "Installment marked as unpaid",
      data: emi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking installment as unpaid",
      error: error.message,
    });
  }
};

// Get EMI summary/statistics
const getEMISummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const emis = await EMI.find({ userId, isActive: true });

    let totalActiveLoans = emis.length;
    let totalOutstanding = 0;
    let totalPaidAmount = 0;
    let totalMonthlyEMI = 0;
    let overdueCount = 0;
    let upcomingThisMonth = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    emis.forEach((emi) => {
      totalMonthlyEMI += emi.monthlyAmount;

      emi.installments.forEach((installment) => {
        if (!installment.isPaid) {
          totalOutstanding += installment.amount;

          // Check if overdue
          if (installment.dueDate < currentDate) {
            overdueCount++;
          }

          // Check if due this month
          if (
            installment.dueDate.getMonth() === currentMonth &&
            installment.dueDate.getFullYear() === currentYear
          ) {
            upcomingThisMonth++;
          }
        } else {
          totalPaidAmount += installment.paidAmount;
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        totalActiveLoans,
        totalOutstanding,
        totalPaidAmount,
        totalMonthlyEMI,
        overdueCount,
        upcomingThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching EMI summary",
      error: error.message,
    });
  }
};

// Delete EMI
const deleteEMI = async (req, res) => {
  try {
    const { emiId } = req.params;
    const userId = req.user._id;

    const emi = await EMI.findOneAndDelete({ _id: emiId, userId });
    if (!emi) {
      return res.status(404).json({
        success: false,
        message: "EMI not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "EMI deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting EMI",
      error: error.message,
    });
  }
};

module.exports = {
  createEMI,
  getEMIs,
  markInstallmentPaid,
  markInstallmentUnpaid,
  getEMISummary,
  deleteEMI,
};
