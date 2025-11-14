const express = require("express");
const router = express.Router();
const {
  createEMI,
  getEMIs,
  markInstallmentPaid,
  markInstallmentUnpaid,
  getEMISummary,
  deleteEMI,
} = require("../controllers/emiController");
const authMiddleware = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// EMI routes
router.post("/", createEMI);
router.get("/", getEMIs);
router.get("/summary", getEMISummary);
router.put("/:emiId/installment/:installmentNumber/pay", markInstallmentPaid);
router.put(
  "/:emiId/installment/:installmentNumber/unpay",
  markInstallmentUnpaid
);
router.delete("/:emiId", deleteEMI);

module.exports = router;
