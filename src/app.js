const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes");
const expenseRoutes = require("./routes/addExpenseRoutes");
const roomExpenseRoutes = require("./routes/roomExpenseRoutes");
const repaymentRoutes = require("./routes/repaymentRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/roomExpenses", roomExpenseRoutes);
app.use("/api/repayments", repaymentRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
