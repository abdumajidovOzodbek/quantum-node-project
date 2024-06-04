const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Initialize as empty array
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Initialize as empty array
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['video', 'news'], required: true }, // New field for type with enum validation
});

postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('viewsCount').get(function() {
  return this.viewers.length;
});

module.exports = mongoose.model('Post', postSchema);
