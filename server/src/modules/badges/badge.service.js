import { Badge } from './badge.model.js';
import { InterviewSession } from '../interview/interview.model.js';
import { Feedback } from '../feedback/feedback.model.js';

// Badge definitions
const BADGE_DEFINITIONS = [
  {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Completed your first interview',
    icon: '🎯',
    check: async (userId) => {
      const count = await InterviewSession.countDocuments({ user: userId, status: 'completed' });
      return count >= 1;
    }
  },
  {
    id: 'five_interviews',
    name: 'Getting Serious',
    description: 'Completed 5 interviews',
    icon: '🔥',
    check: async (userId) => {
      const count = await InterviewSession.countDocuments({ user: userId, status: 'completed' });
      return count >= 5;
    }
  },
  {
    id: 'ten_interviews',
    name: 'Interview Pro',
    description: 'Completed 10 interviews',
    icon: '💎',
    check: async (userId) => {
      const count = await InterviewSession.countDocuments({ user: userId, status: 'completed' });
      return count >= 10;
    }
  },
  {
    id: 'score_90',
    name: 'Top Performer',
    description: 'Scored 90+ in an interview',
    icon: '⭐',
    check: async (userId) => {
      const feedback = await Feedback.findOne({ user: userId, overallScore: { $gte: 90 } });
      return !!feedback;
    }
  },
  {
    id: 'score_100',
    name: 'Perfect Score',
    description: 'Achieved a perfect 100 score',
    icon: '👑',
    check: async (userId) => {
      const feedback = await Feedback.findOne({ user: userId, overallScore: 100 });
      return !!feedback;
    }
  },
  {
    id: 'all_types',
    name: 'Well Rounded',
    description: 'Tried at least 3 different interview types',
    icon: '🌟',
    check: async (userId) => {
      const types = await InterviewSession.distinct('interviewType', { user: userId, status: 'completed' });
      return types.length >= 3;
    }
  },
  {
    id: 'resume_analyzed',
    name: 'Resume Ready',
    description: 'Analyzed your resume with AI',
    icon: '📄',
    // This badge is awarded manually when resume is uploaded
    check: async () => false
  }
];

class BadgeService {
  async checkAndAwardBadges(userId) {
    const awarded = [];

    for (const badgeDef of BADGE_DEFINITIONS) {
      // Skip if already earned
      const existing = await Badge.findOne({ user: userId, badgeId: badgeDef.id });
      if (existing) continue;

      // Check if earned
      const earned = await badgeDef.check(userId);
      if (earned) {
        await Badge.create({
          user: userId,
          badgeId: badgeDef.id,
          name: badgeDef.name,
          description: badgeDef.description,
          icon: badgeDef.icon
        });
        awarded.push(badgeDef.name);
      }
    }

    if (awarded.length > 0) {
      console.log(`[Badges] Awarded to user ${userId}: ${awarded.join(', ')}`);
    }

    return awarded;
  }

  async getUserBadges(userId) {
    return await Badge.find({ user: userId }).sort({ earnedAt: -1 });
  }

  getBadgeDefinitions() {
    return BADGE_DEFINITIONS.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon
    }));
  }
}

export default new BadgeService();
