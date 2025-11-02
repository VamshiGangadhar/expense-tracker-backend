const express = require("express");
const repaymentController = require("../controllers/repaymentController");
const auth = require("../middleware/auth");
const router = express.Router();

// Mark expense as repaid
router.post("/repay/:expenseId", auth, repaymentController.markAsRepaid);

// Mark expense as not repaid (undo)
router.delete("/repay/:expenseId", auth, repaymentController.markAsNotRepaid);

// Get repayment history
router.get("/history", auth, repaymentController.getRepayments);

// Get repayment summary for a month
router.get("/summary", auth, repaymentController.getRepaymentSummary);

module.exports = router;
