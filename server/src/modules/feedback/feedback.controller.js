import { Feedback } from './feedback.model.js';
import { InterviewSession } from '../interview/interview.model.js';

class FeedbackController {
  // @desc    Get feedback for a specific session
  // @route   GET /api/feedback/session/:sessionId
  // @access  Private
  async getBySessionId(req, res, next) {
    try {
      const { sessionId } = req.params;
      const feedback = await Feedback.findOne({ session: sessionId });

      if (!feedback) {
        // If feedback isn't ready yet, it might still be in the queue
        return res.status(202).json({
          success: true,
          message: 'Feedback is still being processed',
          data: null
        });
      }

      res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all feedback for the logged in user
  // @route   GET /api/feedback/my-reports
  // @access  Private
  async getMyReports(req, res, next) {
    try {
      // Temporary fallback if no auth middleware attached yet
      const userId = req.user ? req.user._id : null; 
      
      let query = {};
      if (userId) {
        query.user = userId;
      }

      const reports = await Feedback.find(query)
        .populate('session', 'title createdAt status')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: reports
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedbackController();
