import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  body: {
    type: String,
    required: [true, 'Post body is required'],
    maxlength: [10000, 'Body cannot exceed 10000 characters'],
  },
  category: {
    type: String,
    enum: ['interview-experience', 'tips', 'question', 'resource', 'general'],
    default: 'general',
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  commentCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for efficient querying
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model('Post', postSchema);
