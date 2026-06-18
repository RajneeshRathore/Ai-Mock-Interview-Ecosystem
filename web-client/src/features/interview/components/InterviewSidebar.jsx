import { Clock, Loader2 } from 'lucide-react';

export function InterviewSidebar({ interview, timer, currentQuestionIndex, isFinishing, handleEndInterview }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const roleName = interview?.skills?.[0] || 'Interview';
  const difficulty = interview?.experienceLevel || 'General';
  const aiQuestions = interview?.messages?.filter(m => m.role === 'ai') || [];

  return (
    <div className="w-1/3 flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase">
             {roleName.substring(0, 2)}
           </div>
           <div>
             <div className="font-bold text-slate-900 text-sm">{roleName}</div>
             <div className="text-xs text-slate-500 capitalize">{difficulty} Interview</div>
           </div>
         </div>
         <div className="flex items-center gap-2 text-green-500 font-medium">
           <Clock size={16} />
           <span>{formatTime(timer)}</span>
         </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
         <div className="text-sm font-bold text-slate-500 mb-4">Question {currentQuestionIndex + 1}/{aiQuestions.length || 0}</div>
         <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
           {aiQuestions[currentQuestionIndex]?.content || 'Loading question...'}
         </h3>
         <div className="mt-auto">
           <button 
             onClick={() => handleEndInterview()}
             disabled={isFinishing}
             className="w-full border border-red-200 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
           >
             {isFinishing && <Loader2 size={16} className="animate-spin" />}
             {isFinishing ? 'Ending...' : 'End Interview'}
           </button>
         </div>
      </div>
    </div>
  );
}
