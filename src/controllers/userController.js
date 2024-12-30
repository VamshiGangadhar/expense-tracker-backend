const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Authentication failed");
    }
    const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
    res.send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};