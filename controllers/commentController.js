const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    const comment = await Comment.create({
      content,
      author: req.user.userId,
      post: postId,
    });
console.log(req.user);
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user.userId;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Comment.findByIdAndDelete(commentId);
  
      // Remove the comment reference from the post
      const post = await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId }
      });
  
      res.json({ message: 'Comment deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = { createComment, getCommentsByPost, deleteComment};
