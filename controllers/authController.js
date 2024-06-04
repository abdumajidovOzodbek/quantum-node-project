// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      profilePicture: 'uploads/default-avatar.png', // Set default avatar
    });

    const token = jwt.sign({ userId: user._id }, 'your_secret_key');
    res.json({ username, token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_secret_key');
    res.json({ username, token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
