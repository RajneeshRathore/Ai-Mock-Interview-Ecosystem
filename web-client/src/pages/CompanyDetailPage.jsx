import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ChevronDown, ChevronUp, Building2, Clock, Star, CheckCircle2, Filter } from 'lucide-react';
import { getCompanyById } from '../services/companyService';
import { startInterview } from '../services/interviewService';
import { useAuth } from '../app/providers/AuthProvider';
import Skeleton from '../components/loaders/Skeleton';

const difficultyConfig = {
  Easy: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  Hard: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
};

const categoryColors = {
  'System Design': 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Coding': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Behavioral': 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  'Concepts': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Product': 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  'SQL': 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'DBMS': 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  'Debugging': 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'Case Study': 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
};

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    getCompanyById(id)
      .then(data => setCompany(data))
      .catch(err => {
        console.error('Failed to load company:', err);
        navigate('/dashboard/companies');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStartMockInterview = async () => {
    if (!user || starting) return;
    setStarting(true);
    try {
      const res = await startInterview(user.id, 'technical', company.name, 'Medium');
      const interviewId = res._id || res.id;
      navigate(`/dashboard/interviews/chat?id=${interviewId}&lang=en-US`);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!company) return null;

  const dc = difficultyConfig[company.difficulty] || difficultyConfig.Medium;
  const categories = ['All', ...new Set(company.sampleQuestions.map(q => q.category))];
  const filteredQuestions = categoryFilter === 'All'
    ? company.sampleQuestions
    : company.sampleQuestions.filter(q => q.category === categoryFilter);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/dashboard/companies"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Companies
        </Link>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/5 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-tr-full" />

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
              <img
                src={company.logo}
                alt={company.name}
                className="w-14 h-14 object-contain"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 items-center justify-center text-white font-bold text-2xl" style={{ display: 'none' }}>
                {company.name.charAt(0)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {company.name}
                </h1>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${dc.bg} ${dc.text} border ${dc.border}`}>
                  {company.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{company.industry}</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                {company.description}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              id="start-company-interview"
              onClick={handleStartMockInterview}
              disabled={starting}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} fill="currentColor" />
              {starting ? 'Starting Interview...' : `Start ${company.name} Mock Interview`}
            </button>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" />
                {company.sampleQuestions.length} sample questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {company.interviewProcess.length} interview stages
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interview Process Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">
          Interview Process
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-400 via-indigo-400 to-slate-200 dark:to-slate-700" />

          <div className="space-y-4">
            {company.interviewProcess.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="relative flex items-start gap-5 pl-2"
              >
                {/* Step circle */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20 flex-shrink-0 z-10">
                  {stage.step}
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 transition-colors shadow-sm">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{stage.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stage.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Common Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-5">
          Common Topics
        </h2>
        <div className="flex flex-wrap gap-3">
          {company.commonTopics.map((topic, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium border border-primary-100 dark:border-primary-800/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Sample Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Sample Questions
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="text-slate-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  categoryFilter === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q, i) => {
            const qdc = difficultyConfig[q.difficulty] || difficultyConfig.Medium;
            const catColor = categoryColors[q.category] || 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            const isExpanded = expandedQ === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-2 h-2 rounded-full ${qdc.dot} flex-shrink-0`} />
                  <span className="flex-1 text-slate-800 dark:text-slate-200 font-medium">
                    {q.question}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${catColor} flex-shrink-0`}>
                    {q.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${qdc.bg} ${qdc.text} flex-shrink-0`}>
                    {q.difficulty}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        💡 <strong>Tip:</strong> Practice this question in a mock interview to get AI-powered feedback on your answer.
                      </p>
                      <button
                        onClick={handleStartMockInterview}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                      >
                        <Play size={14} fill="currentColor" />
                        Practice Now
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
