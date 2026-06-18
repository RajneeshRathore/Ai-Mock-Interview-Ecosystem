import express from 'express';
import { upload } from '../../config/cloudinary.js';
import resumeController from './resume.controller.js';

import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('resume'), resumeController.uploadAndAnalyze);

export default router;
