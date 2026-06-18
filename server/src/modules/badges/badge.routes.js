import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import badgeService from './badge.service.js';

const router = express.Router();

router.use(protect);

// @desc    Get current user's badges
// @route   GET /api/badges/my
// @access  Private
router.get('/my', async (req, res, next) => {
  try {
    const badges = await badgeService.getUserBadges(req.user._id);
    res.status(200).json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all badge definitions (for showing locked badges)
// @route   GET /api/badges/definitions
// @access  Private
router.get('/definitions', async (req, res, next) => {
  try {
    const definitions = badgeService.getBadgeDefinitions();
    res.status(200).json({
      success: true,
      data: definitions
    });
  } catch (error) {
    next(error);
  }
});

export default router;
