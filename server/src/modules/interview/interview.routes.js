import express from 'express';
import interviewController from './interview.controller.js';

import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', interviewController.start);
router.get('/history/all', interviewController.history);
router.get('/:id', interviewController.getById);
router.post('/:id/answer', interviewController.answer);
router.post('/:id/end', interviewController.end);

export default router;
