const express = require('express');
const router = express.Router();
const {
  addRoomExpense,
  getRoomExpenses,
  getRoomBalances,
  settleExpense,
  deleteRoomExpense
} = require('../controllers/roomExpenseController');

router.post('/add', addRoomExpense);
router.get('/list', getRoomExpenses);
router.get('/balances', getRoomBalances);
router.patch('/:id/settle', settleExpense);
router.delete('/:id', deleteRoomExpense);

module.exports = router;