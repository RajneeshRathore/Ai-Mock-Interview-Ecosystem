import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Target, Sparkles, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import { startInterview } from '../services/interviewService';

const hrQuestions = [
  {
    category: 'Introduction',
    questions: [
      { id: 'hr1', text: 'Tell me about yourself.', hint: 'Focus on your education, relevant skills, recent projects, and what you are looking for. Keep it to 2 minutes.' },
      { id: 'hr2', text: 'Walk me through your resume.', hint: 'Highlight the most relevant experiences. Explain the impact of your projects rather than just listing technologies.' },
      { id: 'hr3', text: 'Why did you choose this field/degree?', hint: 'Share a brief story of what sparked your interest and how you pursued it.' }
    ]
  },
  {
    category: 'Motivation & Fit',
    questions: [
      { id: 'hr4', text: 'Why do you want to work for our company?', hint: 'Mention specific products, values, or recent news about the company to show you did your research.' },
      { id: 'hr5', text: 'Where do you see yourself in 5 years?', hint: 'Align your goals with the role you are applying for. Focus on learning and taking on more responsibility.' },
      { id: 'hr6', text: 'Why should we hire you?', hint: 'Summarize your top 2-3 strengths and how they directly map to the job requirements.' }
    ]
  },
  {
    category: 'Strengths & Weaknesses',
    questions: [
      { id: 'hr7', text: 'What is your greatest strength?', hint: 'Provide a strength relevant to the role and back it up with a specific example.' },
      { id: 'hr8', text: 'What is your greatest weakness?', hint: 'Share a real weakness (not "I work too hard") and explain what steps you are taking to improve it.' },
      { id: 'hr9', text: 'Tell me about a time you failed.', hint: 'Focus on what you learned from the failure and how you prevented it from happening again.' }
    ]
  },
  {
    category: 'Behavioral (STAR Method)',
    questions: [
      { id: 'hr10', text: 'Tell me about a time you had a conflict with a team member.', hint: 'Use STAR (Situation, Task, Action, Result). Focus on your communication and how you resolved it professionally.' },
      { id: 'hr11', text: 'Describe a situation where you worked under a tight deadline.', hint: 'Explain how you prioritized tasks, managed your time, and delivered the result.' },
      { id: 'hr12', text: 'Tell me about a time you went above and beyond your duties.', hint: 'Show your proactiveness and dedication without complaining about extra work.' }
    ]
  }
];

export default function HRPrepPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [starting, setStarting] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleStartPractice = async (question) => {
    if (!user || starting) return;
    setStarting(true);
    try {
      // Start an interview specifically focused on HR/Behavioral with the selected question as topic
      const res = await startInterview(user.id, 'behavioral', `Behavioral: ${question.text}`, 'Medium');
      const interviewId = res._id || res.id;
      navigate(`/dashboard/interviews/chat?id=${interviewId}&lang=en-US`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Failed to start practice session. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const startFullMock = async () => {
    if (!user || starting) return;
    setStarting(true);
    try {
      const res = await startInterview(user.id, 'behavioral', 'General HR Interview', 'Medium');
      const interviewId = res._id || res.id;
      navigate(`/dashboard/interviews/voice?id=${interviewId}&lang=en-US`);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users size={24} className="text-white" />
            </div>
            <span className="font-semibold tracking-wider uppercase text-sm text-violet-100">HR & Behavioral</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Master the HR Interview
          </h1>
          <p className="text-violet-100 text-sm leading-relaxed">
            Technical skills get you the interview, but soft skills get you the job. 
            Practice the most common HR questions using the STAR method with AI feedback.
          </p>
        </div>
        
        <div className="relative z-10 shrink-0">
          <button
            onClick={startFullMock}
            disabled={starting}
            className="flex items-center gap-2 bg-white text-violet-700 px-6 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full justify-center md:w-auto disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {starting ? <Clock size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {starting ? 'Starting...' : 'Full Voice Mock Interview'}
          </button>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">STAR Method</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Structure your answers: Situation, Task, Action, and Result.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Be Authentic</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Share real experiences and learnings. Don't give robotic answers.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Company Context</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Always relate your answers back to the company's core values.</p>
          </div>
        </div>
      </div>

      {/* Question Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Top Questions by Category
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hrQuestions.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + (idx * 0.1) }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{category.category}</h3>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {category.questions.map((q) => (
                  <div key={q.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2 leading-relaxed">
                      {q.text}
                    </h4>
                    
                    <div className="flex items-start gap-2 mt-3 mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                      <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        {q.hint}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartPractice(q)}
                      disabled={starting}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors disabled:opacity-50"
                    >
                      <Play size={14} fill="currentColor" />
                      Practice this question
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
