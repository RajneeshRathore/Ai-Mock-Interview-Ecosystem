import { InterviewSession } from './interview.model.js';
import aiService from '../ai/ai.service.js';
import { addFeedbackJob } from '../feedback/feedback.queue.js';

class InterviewService {
  async startSession(userId, topic, experienceLevel, interviewType = 'technical') {
    // Generate the first question
    const firstQuestion = await aiService.generateInterviewQuestion(topic, [], null, interviewType, experienceLevel);
    
    const session = await InterviewSession.create({
      user: userId,
      title: `${experienceLevel} ${topic} Interview`,
      interviewType,
      skills: [topic],
      experienceLevel,
      messages: [{ role: 'ai', content: firstQuestion }]
    });

    return session;
  }

  async processUserAnswer(sessionId, answer) {
    const session = await InterviewSession.findById(sessionId);
    if (!session) throw new Error('Session not found');

    // Add user's answer
    session.messages.push({ role: 'user', content: answer });

    // Generate the next question based on the history
    const previousQuestions = session.messages
      .filter(m => m.role === 'ai')
      .map(m => m.content);

    const aiResponse = await aiService.generateInterviewQuestion(
      session.skills[0], 
      previousQuestions,
      answer,
      session.interviewType,
      session.experienceLevel
    );

    // Parse per-question scoring if AI returned JSON
    let nextQuestion = aiResponse;
    let score = null;
    let aiFeedback = null;

    if (typeof aiResponse === 'object' && aiResponse !== null) {
      nextQuestion = aiResponse.nextQuestion || aiResponse.evaluation || aiResponse;
      score = aiResponse.score || null;
      aiFeedback = aiResponse.evaluation || null;

      // If we have a score, update the user's last message with it
      if (score !== null) {
        const lastUserMsgIndex = session.messages.length - 1;
        session.messages[lastUserMsgIndex].score = score;
        session.messages[lastUserMsgIndex].aiFeedback = aiFeedback;
      }
    }

    // Add AI's next question
    session.messages.push({ role: 'ai', content: typeof nextQuestion === 'string' ? nextQuestion : JSON.stringify(nextQuestion) });
    await session.save();

    return {
      session,
      nextQuestion: typeof nextQuestion === 'string' ? nextQuestion : JSON.stringify(nextQuestion),
      score,
      aiFeedback
    };
  }

  async endSession(sessionId, duration = 0) {
    const session = await InterviewSession.findByIdAndUpdate(
      sessionId,
      { status: 'completed', completedAt: new Date(), duration },
      { returnDocument: 'after' }
    );
    
    // Trigger background feedback generation
    await addFeedbackJob(sessionId);

    return session;
  }
}

export default new InterviewService();
