// routes/postRoutes.js
const express = require('express');
const { createPost, updatePost, getPosts, likePost, viewPost, deleteComment, getPostById, checkLiked, getPostsByUserId, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/posts', authMiddleware, upload.single('media'), createPost);
router.put('/posts/:postId', authMiddleware, updatePost);
router.get('/posts', getPosts);
router.get('/posts/:userId',authMiddleware, getPostsByUserId);
router.post('/posts/:postId/like', authMiddleware, likePost);
router.get('/posts/:postId/checkliked', authMiddleware, checkLiked);
router.get('/posts/:postId', getPostById)
router.post('/posts/:postId/view', authMiddleware, viewPost);
router.delete('/posts/:postId/comments/:commentId', authMiddleware, deleteComment);
router.delete('/posts/:postId', authMiddleware, deletePost);

module.exports = router;
