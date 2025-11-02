const express = require('express');
const repaymentController = require('../controllers/repaymentController');
const router = express.Router();

// Mark expense as repaid
router.post('/repay/:expenseId', repaymentController.markAsRepaid);

// Mark expense as not repaid (undo)
router.delete('/repay/:expenseId', repaymentController.markAsNotRepaid);

// Get repayment history
router.get('/history', repaymentController.getRepayments);

// Get repayment summary for a month
router.get('/summary', repaymentController.getRepaymentSummary);

module.exports = router;