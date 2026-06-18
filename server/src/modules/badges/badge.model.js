import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: {
    type: String,
    default: '🏆'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate badges for the same user
badgeSchema.index({ user: 1, badgeId: 1 }, { unique: true });

export const Badge = mongoose.model('Badge', badgeSchema);
