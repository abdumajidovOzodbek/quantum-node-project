const express = require('express');
const { createComment, getCommentsByPost } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { deleteComment } = require('../controllers/postController');

const router = express.Router();

router.post('/comments', authMiddleware, createComment);
router.get('/posts/:postId/comments', getCommentsByPost);
router.delete('/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
