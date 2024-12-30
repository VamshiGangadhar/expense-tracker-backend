const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3000");
});

module.exports = app;