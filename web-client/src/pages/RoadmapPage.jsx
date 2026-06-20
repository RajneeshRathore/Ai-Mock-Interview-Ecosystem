import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Map, Calendar, ChevronRight, CheckCircle2, Circle, ArrowRight, Lightbulb, Code, User, Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ai_interview_roadmap';
const COMPLETED_KEY = 'ai_interview_roadmap_completed';

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [targetCompany, setTargetCompany] = useState('');

  // ─── Lazy initializers: read localStorage BEFORE first render ──
  // This prevents the race condition where the persist effects fire
  // with empty state (on mount) and wipe out saved data before the
  // restore effect can load it.
  const [duration, setDuration] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved).duration || '4') : '4';
    } catch { return '4'; }
  });

  const [roadmap, setRoadmap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).roadmap : null;
    } catch { return null; }
  });

  const [generating, setGenerating] = useState(false);

  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  // ─── Persist roadmap to localStorage whenever it changes ─────
  useEffect(() => {
    if (roadmap) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ roadmap, duration }));
    }
  }, [roadmap, duration]);

  // ─── Persist completed items to localStorage ─────────────────
  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedItems]));
  }, [completedItems]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!targetCompany) return;
    
    setGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const newRoadmap = generateStaticRoadmap(targetCompany, parseInt(duration));
      setRoadmap(newRoadmap);
      setCompletedItems(new Set()); // reset progress for new roadmap
      setGenerating(false);
    }, 1500);
  };

  const handleClearRoadmap = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPLETED_KEY);
    setRoadmap(null);
    setCompletedItems(new Set());
    setTargetCompany('');
  };

  const toggleItem = (weekIdx, itemIdx) => {
    const key = `${weekIdx}-${itemIdx}`;
    const newSet = new Set(completedItems);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setCompletedItems(newSet);
  };

  const calculateProgress = () => {
    if (!roadmap) return 0;
    const totalItems = roadmap.weeks.reduce((acc, week) => acc + week.items.length, 0);
    if (totalItems === 0) return 0;
    return Math.round((completedItems.size / totalItems) * 100);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Generator Form */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Map size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            AI Interview Study Plan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg">
            Generate a personalized, week-by-week preparation roadmap tailored to your target company and available timeframe.
          </p>

          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Company</label>
              <div className="relative">
                <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, Microsoft..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Timeframe</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all appearance-none"
                >
                  <option value="2">2 Weeks (Crash Course)</option>
                  <option value="4">4 Weeks (Standard)</option>
                  <option value="8">8 Weeks (Comprehensive)</option>
                  <option value="12">12 Weeks (From Scratch)</option>
                </select>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={generating || !targetCompany}
                className="w-full sm:w-auto h-[50px] px-8 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
              >
                {generating ? 'Generating...' : roadmap ? 'Regenerate' : 'Generate'}
              </button>
              {roadmap && (
                <button
                  type="button"
                  onClick={handleClearRoadmap}
                  title="Clear current roadmap"
                  className="h-[50px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-300 dark:hover:border-red-700 transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  <Trash2 size={15} /> New Roadmap
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      {/* Generated Roadmap Display */}
      <AnimatePresence mode="wait">
        {roadmap && !generating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Progress Overview */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * calculateProgress()) / 100}
                    className="text-primary-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{calculateProgress()}%</span>
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your {roadmap.company} Preparation Plan</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Stay consistent. You have {duration} weeks to complete this roadmap.
                </p>
              </div>

              <button 
                onClick={() => navigate('/dashboard/interviews/new')}
                className="shrink-0 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                Take Mock Test <ArrowRight size={16} />
              </button>
            </div>

            {/* Timeline */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              {roadmap.weeks.map((week, weekIdx) => {
                const isAllCompleted = week.items.every((_, itemIdx) => completedItems.has(`${weekIdx}-${itemIdx}`));
                
                return (
                  <div key={weekIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10 transition-colors duration-300 ${isAllCompleted ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {isAllCompleted ? <CheckCircle2 size={18} /> : <span className="font-bold text-sm">{weekIdx + 1}</span>}
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Week {weekIdx + 1}: {week.title}</h4>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                          {week.focus}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        {week.items.map((item, itemIdx) => {
                          const isCompleted = completedItems.has(`${weekIdx}-${itemIdx}`);
                          return (
                            <div 
                              key={itemIdx}
                              onClick={() => toggleItem(weekIdx, itemIdx)}
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group/item ${
                                isCompleted 
                                  ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800/50' 
                                  : 'bg-slate-50/50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 size={18} className="text-primary-500" />
                                ) : (
                                  <Circle size={18} className="text-slate-300 dark:text-slate-600 group-hover/item:text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium transition-colors ${isCompleted ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                  {item.task}
                                </p>
                                {item.action === 'mock' && !isCompleted && (
                                  <button onClick={(e) => { e.stopPropagation(); navigate('/dashboard/interviews/new'); }} className="mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline">
                                    <Play size={10} fill="currentColor" /> Take Mock Now
                                  </button>
                                )}
                              </div>
                              
                              {/* Task type icon */}
                              <div className="shrink-0 text-slate-400">
                                {item.type === 'dsa' && <Code size={14} />}
                                {item.type === 'hr' && <User size={14} />}
                                {item.type === 'system' && <Lightbulb size={14} />}
                                {item.type === 'mock' && <Target size={14} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper to generate a realistic looking roadmap based on duration
function generateStaticRoadmap(company, durationWeeks) {
  const roadmap = {
    company: company.charAt(0).toUpperCase() + company.slice(1),
    weeks: []
  };

  if (durationWeeks === 2) {
    roadmap.weeks = [
      {
        title: 'Core Fundamentals & Patterns',
        focus: 'DSA & Quick Review',
        items: [
          { task: `Review top 50 highly asked questions for ${roadmap.company}`, type: 'dsa' },
          { task: 'Master Two Pointers, Sliding Window, and Tree Traversals', type: 'dsa' },
          { task: 'Complete a general technical mock interview', type: 'mock', action: 'mock' },
          { task: 'Review resume bullet points using STAR method', type: 'hr' }
        ]
      },
      {
        title: 'Advanced Prep & Execution',
        focus: 'Mocks & HR',
        items: [
          { task: 'Practice Dynamic Programming and Graph algorithms', type: 'dsa' },
          { task: `Take a company-specific mock interview for ${roadmap.company}`, type: 'mock', action: 'mock' },
          { task: 'Prepare "Tell me about yourself" and "Why this company?"', type: 'hr' },
          { task: 'Take a Behavioral Mock Interview', type: 'mock', action: 'mock' }
        ]
      }
    ];
  } else if (durationWeeks === 4) {
    roadmap.weeks = [
      {
        title: 'Data Structures Refresher',
        focus: 'Arrays & Strings',
        items: [
          { task: 'Master Arrays, Strings, and Two Pointers', type: 'dsa' },
          { task: 'Solve 15 Easy/Medium problems on Arrays', type: 'dsa' },
          { task: 'Update Resume and run it through the Resume Analyzer', type: 'hr' }
        ]
      },
      {
        title: 'Complex Structures',
        focus: 'Trees & Graphs',
        items: [
          { task: 'Master Binary Trees, BSTs, and DFS/BFS', type: 'dsa' },
          { task: 'Solve 10 Medium problems on Trees/Graphs', type: 'dsa' },
          { task: 'Take a mid-point Technical Mock Interview', type: 'mock', action: 'mock' }
        ]
      },
      {
        title: 'Algorithmic Paradigms',
        focus: 'DP & Core Logic',
        items: [
          { task: 'Master Dynamic Programming (1D and 2D)', type: 'dsa' },
          { task: 'Review System Design fundamentals (if applicable)', type: 'system' },
          { task: 'Draft answers for common Behavioral/HR questions', type: 'hr' }
        ]
      },
      {
        title: 'Company Specific Prep',
        focus: 'Mocks & Polish',
        items: [
          { task: `Solve top 30 most asked questions at ${roadmap.company}`, type: 'dsa' },
          { task: `Take a company-specific mock interview for ${roadmap.company}`, type: 'mock', action: 'mock' },
          { task: 'Take a Behavioral Mock Interview', type: 'mock', action: 'mock' },
          { task: 'Review all mock interview feedback reports', type: 'mock' }
        ]
      }
    ];
  } else {
    // 8+ weeks strategy
    for (let i = 0; i < durationWeeks; i++) {
      if (i < durationWeeks / 2) {
        roadmap.weeks.push({
          title: `Deep Dive Phase Part ${i + 1}`,
          focus: 'Core DSA',
          items: [
            { task: `Study specific data structure category (Topic ${i+1})`, type: 'dsa' },
            { task: 'Solve 15-20 categorized problems', type: 'dsa' },
            { task: 'Weekly review technical mock interview', type: 'mock', action: 'mock' }
          ]
        });
      } else if (i < durationWeeks - 2) {
        roadmap.weeks.push({
          title: `Advanced Topics & Design ${i - Math.floor(durationWeeks/2) + 1}`,
          focus: 'Advanced & System',
          items: [
            { task: 'Study Advanced Algorithms / System Design', type: 'system' },
            { task: 'Solve Hard difficulty problems', type: 'dsa' },
            { task: 'Practice Behavioral STAR stories', type: 'hr' }
          ]
        });
      } else {
        roadmap.weeks.push({
          title: i === durationWeeks - 1 ? 'Final Review & Polish' : 'Company Specific Prep',
          focus: 'Mocks & Execution',
          items: [
            { task: `Solve ${roadmap.company} specific questions`, type: 'dsa' },
            { task: `Take full ${roadmap.company} Mock Interview`, type: 'mock', action: 'mock' },
            { task: 'Rest and mental preparation', type: 'hr' }
          ]
        });
      }
    }
  }

  return roadmap;
}
