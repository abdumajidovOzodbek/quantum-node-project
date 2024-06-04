// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'uploads/default-avatar.png' }, // Default avatar
});

module.exports = mongoose.model('User', userSchema);
