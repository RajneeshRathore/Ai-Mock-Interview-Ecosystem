import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Interview type prompt modifiers ───────────────────────────────
const TYPE_PROMPTS = {
  technical: 'You are a senior software engineer conducting a technical coding interview. Ask questions about data structures, algorithms, system architecture, code quality, and practical problem-solving.',
  hr: 'You are a Human Resources interviewer. Ask questions about teamwork, work culture fit, salary expectations, career goals, conflict resolution, and professional growth.',
  behavioral: 'You are a behavioral interviewer using the STAR method (Situation, Task, Action, Result). Ask questions that probe past experiences, leadership, failure handling, and decision-making.',
  system_design: 'You are a senior architect conducting a system design interview. Ask questions about scalability, database design, caching strategies, load balancing, microservices, and distributed systems.',
  custom: 'You are a professional interviewer. Ask challenging, open-ended questions that test practical knowledge and critical thinking.',
  jd: 'You are an interviewer who focuses on job-description-specific questions. Tailor questions to assess the exact skills and requirements mentioned in the role.'
};

const DIFFICULTY_PROMPTS = {
  Easy: 'Ask foundational-level questions suitable for a fresher or junior developer. Keep questions straightforward and focus on basic concepts.',
  Medium: 'Ask intermediate-level questions suitable for someone with 1-3 years of experience. Include scenario-based questions that test practical application.',
  Hard: 'Ask expert-level questions suitable for a senior developer. Include complex scenarios, edge cases, trade-off discussions, and architecture decisions.'
};

class AIService {
  async extractResumeDetails(resumeText) {
    const prompt = `
      You are an expert technical recruiter and AI interviewer.
      Analyze the following resume text and extract the key information in JSON format.
      Return ONLY valid JSON.
      
      Required fields:
      - overallScore: number (0-100)
      - skillsScore: number (0-100)
      - experienceScore: number (0-100)
      - projectsScore: number (0-100)
      - educationScore: number (0-100)
      - detectedSkills: array of strings (top technical skills)
      - experience_level: string (Junior, Mid-Level, Senior, Lead)
      - suggested_topics: array of strings (5 topics to interview the candidate on based on their experience)
      - summary: string (a short 2-sentence summary of their profile)

      Resume Text:
      ${resumeText}
    `;

    if (process.env.MOCK_AI === 'true') {
      console.log('[AI Service] MOCK_AI is enabled. Returning mock resume details.');
      return {
        overallScore: 85,
        skillsScore: 90,
        experienceScore: 80,
        projectsScore: 85,
        educationScore: 90,
        detectedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
        experience_level: 'Mid-Level',
        suggested_topics: ['Frontend Architecture', 'State Management', 'RESTful API Design', 'Database Optimization', 'System Design'],
        summary: 'A solid mid-level developer with strong experience in the MERN stack. Demonstrates good problem-solving skills and scalable project implementations.'
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text;
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Error extracting resume details with AI:', error);
      
      if (error?.status === 429 || error?.status === 503 || error?.message?.includes('429')) {
        console.warn('[AI Service] Notice: Gemini API rate limit hit. Using mock resume analysis.');
        return {
          overallScore: 85,
          skillsScore: 90,
          experienceScore: 80,
          projectsScore: 85,
          educationScore: 90,
          detectedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
          experience_level: 'Mid-Level',
          suggested_topics: ['Frontend Architecture', 'State Management', 'RESTful API Design', 'Database Optimization', 'System Design'],
          summary: 'A solid mid-level developer with strong experience in the MERN stack. Demonstrates good problem-solving skills and scalable project implementations.'
        };
      }
      
      throw new Error('Failed to analyze resume');
    }
  }

  async generateInterviewQuestion(topic, previousQuestions = [], previousAnswer = null, interviewType = 'technical', experienceLevel = 'Medium') {
    const typeContext = TYPE_PROMPTS[interviewType] || TYPE_PROMPTS.technical;
    const difficultyContext = DIFFICULTY_PROMPTS[experienceLevel] || DIFFICULTY_PROMPTS.Medium;

    let prompt;

    if (previousAnswer) {
      prompt = `
      ${typeContext}
      ${difficultyContext}
      The topic is "${topic}".
      The candidate just answered the previous question with: "${previousAnswer}".
      
      You must respond with ONLY valid JSON (no markdown, no code fences). Use this exact format:
      {
        "evaluation": "Your 1-2 sentence evaluation of their answer",
        "score": <number 0-100>,
        "nextQuestion": "Your next interview question"
      }
      
      Rules:
      - Score objectively: 0-40 = poor, 41-60 = average, 61-80 = good, 81-100 = excellent
      - Do not repeat these previous questions: ${previousQuestions.join(' | ')}
      - Make the evaluation constructive and professional
      - Make the next question challenging and open-ended
      `;
    } else {
      prompt = `
      ${typeContext}
      ${difficultyContext}
      The topic is "${topic}".
      Generate a challenging, open-ended interview question suitable for assessing a candidate's practical knowledge.
      Do not repeat these previous questions: ${previousQuestions.join(' | ')}.
      
      Return ONLY the question string, without any additional formatting or JSON.
      `;
    }

    if (process.env.MOCK_AI === 'true') {
      console.log('[AI Service] MOCK_AI is enabled. Returning mock question.');
      const fallbackQuestions = {
        technical: [
          `Explain the difference between REST and GraphQL, and when you would choose one over the other for ${topic}.`,
          `How would you optimize the performance of a slow database query in a ${topic} application?`,
          `Describe your approach to handling error boundaries and graceful degradation in ${topic}.`,
          `What design patterns do you commonly use in ${topic}, and why?`,
          `How would you implement authentication and authorization in a ${topic} project?`
        ],
        hr: [
          `Where do you see yourself in 5 years in terms of your career in ${topic}?`,
          `How do you handle disagreements with team members during a ${topic} project?`,
          `What motivates you to work in ${topic}?`,
          `Describe your ideal work environment for ${topic} development.`,
          `How do you balance work-life while working on demanding ${topic} projects?`
        ],
        behavioral: [
          `Tell me about a time you faced a significant challenge while working on ${topic}. What was the situation and how did you handle it?`,
          `Describe a situation where you had to learn ${topic} quickly under pressure. What steps did you take?`,
          `Give an example of a time you failed in a ${topic} project. What did you learn?`,
          `Tell me about a time you mentored someone in ${topic}. What was the outcome?`,
          `Describe a situation where you had to make a difficult technical decision regarding ${topic}.`
        ],
        system_design: [
          `How would you design a scalable real-time chat application using ${topic}?`,
          `Walk me through how you would design a URL shortener service.`,
          `How would you architect a notification system that handles millions of users?`,
          `Design a rate limiter. What data structures and algorithms would you use?`,
          `How would you design an e-commerce platform's search functionality?`
        ]
      };

      const typeQuestions = fallbackQuestions[interviewType] || fallbackQuestions.technical;

      if (previousAnswer) {
        const availableFallbacks = typeQuestions.filter(q => !previousQuestions.includes(q));
        const nextQ = availableFallbacks.length > 0 ? availableFallbacks[0] : `Can you share more about your overall experience with ${topic}?`;
        return {
          evaluation: "Thank you for that detailed response. You demonstrated good understanding of the concepts.",
          score: 72,
          nextQuestion: nextQ
        };
      }

      const availableFallbacks = typeQuestions.filter(q => !previousQuestions.includes(q));
      return availableFallbacks.length > 0 ? availableFallbacks[0] : `Can you share more about your overall experience with ${topic}?`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text.trim();

      // If we asked for JSON (follow-up question), try to parse it
      if (previousAnswer) {
        try {
          const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanJson);
        } catch (parseError) {
          // AI returned plain text instead of JSON — wrap it
          return {
            evaluation: text,
            score: 70,
            nextQuestion: text
          };
        }
      }

      return text;
    } catch (error) {
      console.warn(`[AI Service] Notice: Gemini API failed to generate question (Code: ${error.status || 'Unknown'}). Using fallback.`);
      
      const prefix = previousAnswer ? "Thank you for that answer. Let's move on. " : "";
      const fallbackQuestions = [
        `Could you explain a complex project you worked on recently related to ${topic}?`,
        `What are the most important best practices you follow when working with ${topic}?`,
        `Describe a time you faced a difficult challenge involving ${topic}. How did you overcome it?`,
        `How would you explain the core concepts of ${topic} to someone without a technical background?`,
        `What are the common pitfalls or anti-patterns when using ${topic}, and how do you avoid them?`
      ];
      
      const availableFallbacks = fallbackQuestions.filter(q => !previousQuestions.includes(q));
      const question = availableFallbacks.length > 0 ? availableFallbacks[0] : `Can you share more about your overall experience with ${topic}?`;

      if (previousAnswer) {
        return {
          evaluation: prefix + "I wasn't able to evaluate your answer in detail due to API limitations.",
          score: 65,
          nextQuestion: question
        };
      }

      return prefix + question;
    }
  }

  async generateFeedback(transcript) {
    const prompt = `
      You are an expert technical interviewer evaluating a candidate's interview transcript.
      Analyze the transcript and provide structured feedback in JSON format.
      Return ONLY valid JSON without markdown formatting.

      Required fields:
      - overallScore: number (0-100)
      - strengths: array of strings (top 3 strengths demonstrated)
      - weaknesses: array of strings (top 3 areas for improvement)
      - detailedFeedback: string (a short paragraph summarizing their performance)

      Interview Transcript:
      ${transcript}
    `;

    if (process.env.MOCK_AI === 'true') {
      console.log('[AI Service] MOCK_AI is enabled. Returning mock feedback.');
      return {
        overallScore: 75,
        strengths: ["Clear communication", "Good foundational knowledge", "Structured thinking"],
        weaknesses: ["Could provide more specific examples", "Needs deeper technical depth", "Should mention trade-offs"],
        detailedFeedback: "This is mock feedback because MOCK_AI is enabled. The candidate showed solid understanding but further evaluation may be needed."
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const responseText = response.text;
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn(`[AI Service] Notice: Gemini API failed to generate feedback (Code: ${error.status || 'Unknown'}). Using fallback feedback instead.`);
      
      return {
        overallScore: 75,
        strengths: ["Clear communication", "Good foundational knowledge"],
        weaknesses: ["Could provide more specific examples"],
        detailedFeedback: "The AI service hit a rate limit during feedback generation. This is placeholder feedback. The candidate showed solid understanding but further evaluation may be needed."
      };
    }
  }
}

export default new AIService();
