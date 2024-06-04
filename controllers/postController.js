// controllers/postController.js
const { resolve } = require('path');
const Post = require('../models/Post');
const fs = require('fs');
const Comment = require('../models/Comment');
const { ObjectId } = require('mongodb');
const createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const mediaUrl = req.file ? `uploads/${req.file.filename}` : null;

    const newPost = new Post({
      title,
      content: content ? content : null,
      mediaUrl,
      type, // Ensure type is included
      author: req.user.userId, // Assuming userId is attached to the request after authentication
      likes: [],
      viewers: [],
    });

    await newPost.save();

    res.status(201).json({ post: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'username profilePicture')
      .populate('comments')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { likes, viewers, ...postWithoutSensitiveFields } = post;
    const formattedPost = {
      ...postWithoutSensitiveFields,
      likesCount: likes ? likes.length : 0,
      viewsCount: viewers ? viewers.length : 0,
    };

    res.json({ post: formattedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(postId);
    console.log(req.body);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.json({ message: 'Post updated', post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture _id')
      .populate('comments')
      .lean();

    const formattedPosts = posts.map(post => {
      const { likes, viewers, ...postWithoutSensitiveFields } = post;
      return {
        ...postWithoutSensitiveFields,
        likesCount: likes ? likes.length : 0,
        viewsCount: viewers ? viewers.length : 0,
      };
    });

    res.json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      return res.status(202).json({ message: 'You have already liked this post' });
    }

    post.likes.push(userId);
    await post.save();

    res.json({ message: 'Post liked', likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const checkLiked = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      return res.status(202).json({ message: 'You have already liked this post' });
    }
    res.json({ message: 'no like', likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.viewers.includes(userId)) {
      post.viewers.push(userId);
      await post.save();
    }

    res.json({ message: 'Post viewed', viewsCount: post.viewers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;
    await Comment.findByIdAndDelete(commentId)

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const posts = await Post.find({ author: userId })
      .populate('author', 'username profilePicture _id')
      .populate('comments')
      .lean();

    const formattedPosts = posts.map(post => {
      const { likes, viewers, ...postWithoutSensitiveFields } = post;
      return {
        ...postWithoutSensitiveFields,
        likesCount: likes ? likes.length : 0,
        viewsCount: viewers ? viewers.length : 0,
      };
    });

    res.json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findByIdAndDelete(postId)
    fs.unlinkSync(resolve(post.mediaUrl))
    console.log(post);
    res.status(200).json({ message: 'Post succesfully deleted' })
  } catch (error) {
    res.status(400).json({ message: "Post didn't deleted something wrong" })
  }
}
module.exports = { createPost, updatePost, getPosts, likePost, viewPost, deleteComment, getPostById, checkLiked, getPostsByUserId, deletePost };
