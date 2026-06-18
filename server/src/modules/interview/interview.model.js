import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'user'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  aiFeedback: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Technical Interview'
  },
  interviewType: {
    type: String,
    enum: ['technical', 'hr', 'behavioral', 'system_design', 'custom', 'jd'],
    default: 'technical'
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  skills: [String],
  experienceLevel: String,
  messages: [messageSchema],
  duration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
