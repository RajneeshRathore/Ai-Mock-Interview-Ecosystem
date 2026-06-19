import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, Circle, RefreshCw, Sparkles, Coffee, FileText, Shirt, Wifi, Battery, BrainCircuit, Clock } from 'lucide-react';

const checklistSections = [
  {
    title: 'Documents & Setup',
    icon: <FileText size={18} />,
    color: 'from-blue-500 to-cyan-500',
    items: [
      { id: 'resume', text: 'Resume printed / digital copy ready', tip: 'Keep 2–3 printed copies. Save a PDF on your phone as backup.' },
      { id: 'id', text: 'Government ID / College ID ready', tip: 'Some companies require identity verification at the gate.' },
      { id: 'offer', text: 'Offer letter / interview invite email saved', tip: 'Screenshot or print the email with venue, time, and interviewer name.' },
      { id: 'portfolio', text: 'Portfolio / GitHub links accessible', tip: 'Make sure your projects are deployed and repos are public.' },
    ]
  },
  {
    title: 'Technical Preparation',
    icon: <BrainCircuit size={18} />,
    color: 'from-violet-500 to-purple-500',
    items: [
      { id: 'dsa-review', text: 'Revised top DSA patterns (Arrays, Trees, DP)', tip: 'Focus on patterns, not individual problems. Review your solved list.' },
      { id: 'projects', text: 'Can explain all resume projects in 2 min each', tip: 'Practice: What was the problem? What did you build? What was the impact?' },
      { id: 'system-design', text: 'System Design basics reviewed (if applicable)', tip: 'Know how to design URL shortener, chat system, or notification service.' },
      { id: 'language', text: 'Comfortable with your primary coding language', tip: 'Know syntax for common operations: sorting, hash maps, string manipulation.' },
    ]
  },
  {
    title: 'HR & Behavioral',
    icon: <Sparkles size={18} />,
    color: 'from-amber-500 to-orange-500',
    items: [
      { id: 'intro', text: '"Tell me about yourself" answer prepared', tip: 'Keep it under 2 minutes. Education → Skills → Projects → What you seek.' },
      { id: 'why-company', text: '"Why this company?" answer prepared', tip: 'Mention specific products, values, or recent news to show genuine interest.' },
      { id: 'star', text: '3 STAR stories ready (conflict, failure, leadership)', tip: 'Situation → Task → Action → Result. Keep each under 90 seconds.' },
      { id: 'questions', text: 'Questions to ask the interviewer prepared', tip: 'Ask about team culture, growth opportunities, or current tech challenges.' },
    ]
  },
  {
    title: 'Day-Before Logistics',
    icon: <Clock size={18} />,
    color: 'from-emerald-500 to-teal-500',
    items: [
      { id: 'outfit', text: 'Interview outfit selected and ironed', tip: 'Business casual is usually safe. Avoid overly casual or flashy clothing.' },
      { id: 'route', text: 'Route to venue / video call link tested', tip: 'For in-person: plan to arrive 15 min early. For virtual: test the link.' },
      { id: 'sleep', text: 'Alarm set, 7-8 hours sleep planned', tip: 'Sleep is more valuable than last-minute cramming. Rest your brain.' },
      { id: 'meal', text: 'Light meal planned before interview', tip: 'Eat something light but energizing. Avoid heavy food that causes drowsiness.' },
    ]
  },
  {
    title: 'Virtual Interview Setup',
    icon: <Wifi size={18} />,
    color: 'from-rose-500 to-pink-500',
    items: [
      { id: 'internet', text: 'Internet connection stable', tip: 'Use wired if possible. Have mobile hotspot as backup.' },
      { id: 'camera', text: 'Camera and microphone tested', tip: 'Do a test call with a friend. Check lighting and background.' },
      { id: 'battery', text: 'Laptop fully charged + charger nearby', tip: 'Don\'t risk running out of battery mid-interview.' },
      { id: 'background', text: 'Clean, quiet background ready', tip: 'Plain wall or virtual background. Inform family/roommates not to disturb.' },
      { id: 'ide', text: 'Online IDE or code editor ready', tip: 'Have VS Code or an online editor like CodeSandbox open and ready.' },
    ]
  },
];

export default function InterviewChecklistPage() {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem('interview-checklist');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [showTip, setShowTip] = useState(null);

  const toggleItem = (id) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setChecked(newChecked);
    localStorage.setItem('interview-checklist', JSON.stringify([...newChecked]));
  };

  const resetAll = () => {
    setChecked(new Set());
    localStorage.removeItem('interview-checklist');
  };

  const totalItems = checklistSections.reduce((acc, s) => acc + s.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Interview Checklist</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Make sure you're 100% ready before the big day</p>
          </div>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-900 dark:text-white">Readiness Score</span>
          <span className={`text-2xl font-display font-bold ${progress === 100 ? 'text-emerald-500' : progress >= 50 ? 'text-amber-500' : 'text-slate-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${progress === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-primary-500 to-indigo-500'}`}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {checked.size} of {totalItems} items completed
          {progress === 100 && ' — You\'re all set! 🎉'}
        </p>
      </motion.div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {checklistSections.map((section, sIdx) => {
          const sectionCompleted = section.items.every(item => checked.has(item.id));
          
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + sIdx * 0.08 }}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                sectionCompleted 
                  ? 'border-emerald-200 dark:border-emerald-800' 
                  : 'border-slate-100 dark:border-slate-800'
              }`}
            >
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-sm`}>
                    {section.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{section.title}</h3>
                </div>
                {sectionCompleted && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                    ✓ Complete
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {section.items.map((item) => {
                  const isChecked = checked.has(item.id);
                  const isTipOpen = showTip === item.id;
                  
                  return (
                    <div key={item.id}>
                      <div
                        onClick={() => toggleItem(item.id)}
                        className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 group ${
                          isChecked ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="shrink-0">
                          {isChecked ? (
                            <CheckCircle2 size={22} className="text-emerald-500" />
                          ) : (
                            <Circle size={22} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                          )}
                        </div>
                        <span className={`flex-1 text-sm font-medium transition-all ${
                          isChecked 
                            ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600' 
                            : 'text-slate-700 dark:text-slate-200'
                        }`}>
                          {item.text}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTip(isTipOpen ? null : item.id);
                          }}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg transition-all ${
                            isTipOpen 
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                              : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                          }`}
                        >
                          💡 Tip
                        </button>
                      </div>
                      
                      {isTipOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-6 pb-4 pl-16"
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 leading-relaxed">
                            {item.tip}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Footer */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white shadow-xl"
        >
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-display font-bold text-2xl mb-2">You're 100% Ready!</h3>
          <p className="text-emerald-100 max-w-md mx-auto">
            You've prepared thoroughly. Walk in with confidence — you've got this!
          </p>
        </motion.div>
      )}
    </div>
  );
}
