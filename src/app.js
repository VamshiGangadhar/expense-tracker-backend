const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes");
const expenseRoutes = require("./routes/addExpenseRoutes");
const roomExpenseRoutes = require('./routes/roomExpenseRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/expenses", expenseRoutes);
app.use('/api/roomExpenses', roomExpenseRoutes);

app.listen(3004, () => {
  console.log("Server running on port 3004");
});

module.exports = app;
