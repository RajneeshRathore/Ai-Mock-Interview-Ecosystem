import { Redis } from '@upstash/redis';
import { InterviewSession } from '../interview/interview.model.js';
import { Feedback } from './feedback.model.js';
import aiService from '../ai/ai.service.js';
import badgeService from '../badges/badge.service.js';
import { sendEmail } from '../../utils/email.js';
import User from '../users/user.model.js';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const QUEUE_KEY = 'feedback:queue';
const POLL_INTERVAL = 3000; // Poll every 3 seconds

const processFeedbackJob = async (job) => {
  const { sessionId } = job.data;
  console.log(`Processing feedback for session: ${sessionId}`);

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    // Build the transcript
    const transcript = session.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

    // Generate feedback using AI
    const analysis = await aiService.generateFeedback(transcript);

    // Save to DB
    await Feedback.create({
      session: session._id,
      user: session.user,
      overallScore: analysis.overallScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      detailedFeedback: analysis.detailedFeedback
    });

    console.log(`Successfully generated feedback for session: ${sessionId}`);

    // Check and award badges
    if (session.user) {
      try {
        await badgeService.checkAndAwardBadges(session.user);
      } catch (badgeErr) {
        console.error('Badge check failed:', badgeErr.message);
      }
    }

    // Send email report to the user
    if (session.user) {
      try {
        const user = await User.findById(session.user);
        if (user && user.email) {
          const scoreColor = analysis.overallScore >= 80 ? '#22c55e' : analysis.overallScore >= 60 ? '#eab308' : '#ef4444';
          const strengthsList = (analysis.strengths || []).map(s => `<li style="padding:4px 0">${s}</li>`).join('');
          const weaknessesList = (analysis.weaknesses || []).map(w => `<li style="padding:4px 0">${w}</li>`).join('');

          await sendEmail({
            to: user.email,
            subject: `Your AI Interview Report — Score: ${analysis.overallScore}%`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <h1 style="color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:16px">🎯 Interview Report</h1>
                <p>Hi ${user.name},</p>
                <p>Your interview session <strong>"${session.title}"</strong> has been reviewed.</p>
                
                <div style="text-align:center;margin:32px 0">
                  <div style="display:inline-block;padding:24px 48px;background:#f8fafc;border-radius:16px;border:2px solid ${scoreColor}">
                    <div style="font-size:48px;font-weight:bold;color:${scoreColor}">${analysis.overallScore}%</div>
                    <div style="color:#64748b;margin-top:8px">Overall Score</div>
                  </div>
                </div>

                <h3 style="color:#22c55e">✅ Strengths</h3>
                <ul style="color:#334155;line-height:1.6">${strengthsList || '<li>No specific strengths noted</li>'}</ul>

                <h3 style="color:#ef4444">📌 Areas for Improvement</h3>
                <ul style="color:#334155;line-height:1.6">${weaknessesList || '<li>No specific areas noted</li>'}</ul>

                <p style="color:#64748b;margin-top:24px">${analysis.detailedFeedback || ''}</p>

                <p style="margin-top:32px;color:#94a3b8;font-size:12px">— AI Interview Platform</p>
              </div>
            `,
          });
          console.log(`Email report sent to ${user.email}`);
        }
      } catch (emailErr) {
        console.error('Failed to send email report:', emailErr.message);
        // Don't throw — email failure shouldn't fail the job
      }
    }

    // Emit Socket.IO event if available
    try {
      const { getIO } = await import('../../server.js');
      const io = getIO();
      if (io && session.user) {
        io.to(session.user.toString()).emit('feedback:ready', {
          sessionId: session._id,
          score: analysis.overallScore
        });
      }
    } catch (socketErr) {
      // Socket.IO not available, ignore
    }

  } catch (error) {
    console.error(`Failed to process feedback for session ${sessionId}:`, error);
    throw error;
  }
};

// Poll-based worker that checks Upstash Redis for new jobs
const startWorker = () => {
  console.log('[FeedbackWorker] Started polling for jobs...');

  const poll = async () => {
    try {
      // RPOP from the queue (FIFO: LPUSH + RPOP)
      const raw = await redis.rpop(QUEUE_KEY);

      if (raw) {
        const job = typeof raw === 'string' ? JSON.parse(raw) : raw;
        console.log(`[FeedbackWorker] Picked up job: ${job.id}`);

        try {
          await processFeedbackJob(job);
          console.log(`[FeedbackWorker] Job ${job.id} completed!`);
        } catch (err) {
          console.error(`[FeedbackWorker] Job ${job.id} failed:`, err.message);
        }
      }
    } catch (err) {
      console.error('[FeedbackWorker] Polling error:', err.message);
    }

    // Schedule next poll
    setTimeout(poll, POLL_INTERVAL);
  };

  // Start the polling loop
  poll();
};

// Auto-start the worker
export const feedbackWorker = startWorker();
