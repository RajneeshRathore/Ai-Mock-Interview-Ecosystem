import interviewService from './interview.service.js';
import { InterviewSession } from './interview.model.js';

class InterviewController {
  // @desc    Start a new interview session
  // @route   POST /api/interview/start
  // @access  Private
  async start(req, res, next) {
    try {
      const { topic, experienceLevel, interviewType } = req.body;
      const userId = req.user._id;
      
      const session = await interviewService.startSession(userId, topic, experienceLevel, interviewType);

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Process answer and get next question
  // @route   POST /api/interview/:id/answer
  // @access  Private
  async answer(req, res, next) {
    try {
      const { id } = req.params;
      const { answer } = req.body;
      
      // Ownership check
      const session = await InterviewSession.findById(id);
      if (!session) {
        res.status(404);
        throw new Error('Session not found');
      }
      if (session.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this interview');
      }

      const result = await interviewService.processUserAnswer(id, answer);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    End interview session
  // @route   POST /api/interview/:id/end
  // @access  Private
  async end(req, res, next) {
    try {
      const { id } = req.params;
      const { duration } = req.body;
      
      // Ownership check
      const session = await InterviewSession.findById(id);
      if (!session) {
        res.status(404);
        throw new Error('Session not found');
      }
      if (session.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this interview');
      }

      const updatedSession = await interviewService.endSession(id, duration);

      res.status(200).json({
        success: true,
        data: updatedSession
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get interview session by ID
  // @route   GET /api/interview/:id
  // @access  Private
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const session = await InterviewSession.findById(id);
      
      if (!session) {
        res.status(404);
        throw new Error('Session not found');
      }

      // Ownership check
      if (session.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this interview');
      }

      res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get interview history
  // @route   GET /api/interview/history/all
  // @access  Private
  async history(req, res, next) {
    try {
      const userId = req.user._id;
      const sessions = await InterviewSession.find({ user: userId }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InterviewController();
