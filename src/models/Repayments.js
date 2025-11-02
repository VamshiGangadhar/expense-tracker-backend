const mongoose = require('mongoose');

// Define the repayment schema
const repaymentSchema = new mongoose.Schema({
    expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'expenses', required: true },
    repaymentType: { type: String, enum: ['lent', 'credit-card'], required: true },
    originalAmount: { type: Number, required: true },
    repaidAmount: { type: Number, required: true },
    repaymentDate: { type: Date, default: Date.now },
    description: { type: String, required: true },
    month: { type: Number, required: true }, // Month when repayment was made (0-11)
    year: { type: Number, required: true },  // Year when repayment was made
    isFullyRepaid: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Create the model
const Repayment = mongoose.model('repayments', repaymentSchema);

module.exports = Repayment;