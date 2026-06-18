import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const QUEUE_KEY = 'feedback:queue';

export const feedbackQueue = {
  redis,
  name: 'feedback',
};

export const addFeedbackJob = async (sessionId) => {
  const job = {
    id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: 'generate-feedback',
    data: { sessionId },
    createdAt: new Date().toISOString(),
  };

  // Push job to the Upstash Redis list
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  console.log(`[FeedbackQueue] Job added for session: ${sessionId}`);
  return job;
};
