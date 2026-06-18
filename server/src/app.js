import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './modules/auth/auth.routes.js';
import resumeRoutes from './modules/resume/resume.routes.js';
import interviewRoutes from './modules/interview/interview.routes.js';
import feedbackRoutes from './modules/feedback/feedback.routes.js';
import userRoutes from './modules/users/user.routes.js';
import badgeRoutes from './modules/badges/badge.routes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/badges', badgeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
