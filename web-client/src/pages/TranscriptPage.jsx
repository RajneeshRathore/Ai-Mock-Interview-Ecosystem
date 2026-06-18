import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain, User, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getInterviewById } from '../services/interviewService';
import Skeleton from '../components/loaders/Skeleton';

export default function TranscriptPage() {
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  const [interview, setInterview] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    if (interviewId) {
      getInterviewById(interviewId)
        .then(session => setInterview(session))
        .catch(err => console.error('Failed to load transcript:', err));
    }
  }, [interviewId]);

  if (!interview) return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  // Pair AI questions with user answers
  const pairs = [];
  const messages = interview.messages || [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === 'ai') {
      const answer = messages[i + 1] && messages[i + 1].role === 'user' ? messages[i + 1] : null;
      pairs.push({ question: messages[i], answer, index: pairs.length });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 animate-fade-in-down opacity-0 animate-fill-forwards">
        <Link to="/dashboard/interviews/history" className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Interview Transcript</h2>
          <p className="text-slate-500 mt-1">
            {interview.title} • {new Date(interview.createdAt).toLocaleDateString()} • 
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {interview.status}
            </span>
          </p>
        </div>
      </div>

      {/* Interview Info Bar */}
      <div className="flex flex-wrap gap-4 animate-fade-in-up opacity-0 animation-delay-100 animate-fill-forwards">
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm">
          <Brain size={16} className="text-indigo-500" />
          <span className="text-slate-600">{interview.interviewType || 'technical'}</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm">
          <Clock size={16} className="text-slate-500" />
          <span className="text-slate-600">{interview.experienceLevel || 'Medium'} difficulty</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm">
          <span className="text-slate-600">{pairs.length} questions</span>
        </div>
      </div>

      {/* Q&A Timeline */}
      <div className="space-y-4 animate-fade-in-up opacity-0 animation-delay-200 animate-fill-forwards">
        {pairs.map((pair, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
          >
            {/* Question Header */}
            <button 
              onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
              className="w-full p-6 flex items-start gap-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                Q{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 leading-relaxed">{pair.question.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  {pair.answer ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle size={12} /> Answered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <XCircle size={12} /> Not answered
                    </span>
                  )}
                  {pair.answer?.score != null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      pair.answer.score >= 80 ? 'bg-green-100 text-green-700' :
                      pair.answer.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Score: {pair.answer.score}%
                    </span>
                  )}
                </div>
              </div>
              <div className="text-slate-400 flex-shrink-0">
                {expandedQ === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {/* Expanded Answer */}
            {expandedQ === idx && pair.answer && (
              <div className="border-t border-slate-100 bg-slate-50/50">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Answer</p>
                      <p className="text-slate-700 leading-relaxed">{pair.answer.content}</p>
                    </div>
                  </div>

                  {pair.answer.aiFeedback && (
                    <div className="mt-4 ml-14 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">AI Evaluation</p>
                      <p className="text-indigo-900 text-sm leading-relaxed">{pair.answer.aiFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {pairs.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Brain className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No messages in this session</h3>
          <p className="text-slate-500 mt-2">This interview session doesn't have any recorded messages.</p>
        </div>
      )}
    </div>
  );
}
