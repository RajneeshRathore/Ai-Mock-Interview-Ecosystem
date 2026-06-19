import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building2, Users, ArrowRight, Star, Filter } from 'lucide-react';
import { getCompanies } from '../services/companyService';
import Skeleton from '../components/loaders/Skeleton';

const difficultyConfig = {
  Easy: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  Medium: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  Hard: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
};

export default function CompanyHubPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    getCompanies()
      .then(data => setCompanies(data))
      .catch(err => console.error('Failed to load companies:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
    return matchSearch && matchDifficulty;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Company Prep Hub
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Practice with company-specific interview questions and processes
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="company-search"
            type="text"
            placeholder="Search companies or industries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          {['All', 'Easy', 'Medium', 'Hard'].map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                difficultyFilter === level
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Company Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Building2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No companies found</h3>
          <p className="text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((company, i) => {
            const dc = difficultyConfig[company.difficulty] || difficultyConfig.Medium;
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Link
                  to={`/dashboard/companies/${company.id}`}
                  id={`company-card-${company.id}`}
                  className="group block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Logo & Difficulty */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-9 h-9 object-contain"
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 items-center justify-center text-white font-bold text-sm" style={{ display: 'none' }}>
                          {company.name.charAt(0)}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${dc.bg} ${dc.text} border ${dc.border}`}>
                        {company.difficulty}
                      </span>
                    </div>

                    {/* Name & Industry */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{company.industry}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star size={13} className="text-amber-400" />
                          {company.questionCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} />
                          {company.stageCount} stages
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
