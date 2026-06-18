import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  overallScore: {
    type: Number,
    required: true
  },
  strengths: [String],
  weaknesses: [String],
  detailedFeedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
