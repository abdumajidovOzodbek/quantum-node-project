// routes/userRoutes.js
const express = require('express');
const { updateProfilePicture, deleteProfilePicture, updateUserProfile, deleteUserProfile, getUserWithPosts, getUserById, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.put('/profile-picture', authMiddleware, upload.single('profilePicture'), updateProfilePicture);
router.delete('/profile-picture', authMiddleware, deleteProfilePicture);
router.put('/profile',authMiddleware,  updateUserProfile);
router.delete('/profile', authMiddleware, deleteUserProfile);
router.get('/users/:userId/posts',authMiddleware, getUserWithPosts)
router.get('/user/:userId',authMiddleware, getUserById)
router.get('/users',authMiddleware, getAllUsers)
module.exports = router;
