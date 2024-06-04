// controllers/userController.js
const User = require('../models/User');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Comment = require('../models/Comment');

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the old profile picture if it's not the default one
    if (user.profilePicture !== 'uploads/default-avatar.png') {
      fs.unlinkSync(path.join(__dirname, '..', user.profilePicture));
    }

    user.profilePicture = req.file.path;
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: '' });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profilePicture !== 'uploads/default-avatar.png') {
      fs.unlinkSync(path.join(__dirname, '..', user.profilePicture));
    }

    user.profilePicture = 'uploads/default-avatar.png';
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      user.username = username;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'User profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Comment.deleteMany({ author: userId });

    const userPosts = await Post.find({ author: userId });


    for (const post of userPosts) {
      await Comment.deleteMany({ post: post._id });
    }

    await Post.deleteMany({ author: userId });

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User profile and related data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserWithPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: userId }).lean()

    const formattedPosts = posts.map(post => {
      const { likes, viewers, ...postWithoutSensitiveFields } = post;
      return {
        ...postWithoutSensitiveFields,
        likesCount: likes ? likes.length : 0,
        viewsCount: viewers ? viewers.length : 0,
      };
    });

    res.json({ user, posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ message: 'succesfully', users })
  } catch (error) {
    res.status(400).json({ message: 'unsuccesfully' })

  }
};
const getUserById = async (req, res) => {
  try {
    const UserId = req.params.userId
    const user = await User.findById(UserId).select('-password')
    res.status(200).json({ message: 'succesfully', user })
  } catch (error) {
    res.status(400).json({ message: 'unsuccesfully' })

  }
};

module.exports = { updateProfilePicture, deleteProfilePicture, updateUserProfile, deleteUserProfile, getUserWithPosts, getAllUsers, getUserById };
