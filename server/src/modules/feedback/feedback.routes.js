import express from 'express';
import feedbackController from './feedback.controller.js';

import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/session/:sessionId', feedbackController.getBySessionId);
router.get('/my-reports', feedbackController.getMyReports);

export default router;
