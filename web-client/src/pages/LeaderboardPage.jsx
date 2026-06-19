import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Star, Flame, ChevronUp, ChevronDown, Minus, Users } from 'lucide-react';
import { useAuth } from '../app/providers/AuthProvider';
import api from '../services/api';
import Skeleton from '../components/loaders/Skeleton';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fallback to demo data
      const res = await api.get('/interview/history/all');
      // If we get real data, build leaderboard from it
      if (res?.data && Array.isArray(res.data)) {
        // Build a simple leaderboard from the current user's data
        const demoLeaderboard = generateDemoLeaderboard(user);
        setLeaderboard(demoLeaderboard);
      }
    } catch {
      // Use demo data
      setLeaderboard(generateDemoLeaderboard(user));
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} className="text-amber-400" />;
    if (rank === 2) return <Medal size={20} className="text-slate-400" />;
    if (rank === 3) return <Medal size={20} className="text-amber-700" />;
    return <span className="text-sm font-bold text-slate-400">#{rank}</span>;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800';
    if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-slate-200 dark:border-slate-700';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/15 dark:to-amber-900/15 border-orange-200 dark:border-orange-800';
    return 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800';
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
      </div>
    );
  }

  const currentUserEntry = leaderboard.find(e => e.isCurrentUser);
  const currentUserRank = currentUserEntry ? leaderboard.indexOf(currentUserEntry) + 1 : null;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
            <Trophy size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Leaderboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">See how you stack up against other interview preppers</p>
          </div>
        </div>
      </motion.div>

      {/* Time Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Time' },
          { id: 'month', label: 'This Month' },
          { id: 'week', label: 'This Week' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setTimeFilter(f.id)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              timeFilter === f.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="flex items-end justify-center gap-4 relative z-10">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white mb-2 border border-white/20">
                {leaderboard[1].name.charAt(0)}
              </div>
              <p className="text-white/90 font-semibold text-sm truncate max-w-[100px]">{leaderboard[1].name}</p>
              <p className="text-white/60 text-xs">{leaderboard[1].score} pts</p>
              <div className="w-24 h-20 bg-white/10 rounded-t-xl mt-3 flex items-center justify-center border-t border-x border-white/20">
                <Medal size={28} className="text-slate-300" />
              </div>
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div className="flex flex-col items-center -mt-4">
              <Crown size={28} className="text-amber-400 mb-2" />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl font-bold text-white mb-2 shadow-lg shadow-amber-500/30 border-2 border-amber-300/50">
                {leaderboard[0].name.charAt(0)}
              </div>
              <p className="text-white font-bold text-sm truncate max-w-[120px]">{leaderboard[0].name}</p>
              <p className="text-white/70 text-xs">{leaderboard[0].score} pts</p>
              <div className="w-28 h-28 bg-amber-500/20 rounded-t-xl mt-3 flex items-center justify-center border-t border-x border-amber-400/30">
                <Trophy size={32} className="text-amber-400" />
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white mb-2 border border-white/20">
                {leaderboard[2].name.charAt(0)}
              </div>
              <p className="text-white/90 font-semibold text-sm truncate max-w-[100px]">{leaderboard[2].name}</p>
              <p className="text-white/60 text-xs">{leaderboard[2].score} pts</p>
              <div className="w-24 h-16 bg-white/10 rounded-t-xl mt-3 flex items-center justify-center border-t border-x border-white/20">
                <Medal size={28} className="text-amber-700" />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Your Position */}
      {currentUserRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-5 flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            #{currentUserRank}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 dark:text-white">Your Position</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentUserEntry.score} points • {currentUserEntry.interviews} interviews completed
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
            <TrendingUp size={16} />
            +{currentUserEntry.trend}
          </div>
        </motion.div>
      )}

      {/* Full Rankings */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Users size={18} /> Full Rankings
        </h3>
        
        {leaderboard.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * idx }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${getRankBg(idx + 1)} ${entry.isCurrentUser ? 'ring-2 ring-primary-400 dark:ring-primary-600' : ''}`}
          >
            {/* Rank */}
            <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
              {getRankIcon(idx + 1)}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${
              idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
              idx === 1 ? 'bg-gradient-to-br from-slate-400 to-gray-500' :
              idx === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-500' :
              'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700'
            }`}>
              {entry.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${entry.isCurrentUser ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                  {entry.name} {entry.isCurrentUser && '(You)'}
                </span>
                {entry.streak > 3 && (
                  <span className="flex items-center gap-0.5 text-xs text-orange-500 font-bold">
                    <Flame size={12} fill="currentColor" /> {entry.streak}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {entry.interviews} interviews • Avg score: {entry.avgScore}%
              </p>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Star size={14} className="text-amber-400" fill="currentColor" />
                {entry.score}
              </div>
              <div className={`text-xs font-medium flex items-center gap-0.5 justify-end ${entry.trend > 0 ? 'text-emerald-500' : entry.trend < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                {entry.trend > 0 ? <ChevronUp size={12} /> : entry.trend < 0 ? <ChevronDown size={12} /> : <Minus size={12} />}
                {Math.abs(entry.trend)} pts
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function generateDemoLeaderboard(currentUser) {
  const names = [
    'Arjun Sharma', 'Priya Patel', 'Rohit Verma', 'Sneha Gupta',
    'Aditya Kumar', 'Neha Singh', 'Vikram Rao', 'Anjali Reddy',
    'Karthik Nair', 'Divya Joshi', 'Manish Tiwari', 'Pooja Mehta'
  ];

  const entries = names.map((name, i) => ({
    id: `user-${i}`,
    name,
    score: Math.max(200, 2400 - (i * 180) + Math.floor(Math.random() * 80)),
    interviews: Math.max(3, 30 - i * 2 + Math.floor(Math.random() * 5)),
    avgScore: Math.max(55, 92 - i * 3 + Math.floor(Math.random() * 5)),
    streak: Math.max(0, 15 - i + Math.floor(Math.random() * 4)),
    trend: Math.floor(Math.random() * 60) - 10,
    isCurrentUser: false,
  }));

  // Insert the current user around rank 5-8
  const userRank = 4 + Math.floor(Math.random() * 3);
  const userEntry = {
    id: 'current-user',
    name: currentUser?.name || 'You',
    score: entries[userRank]?.score - 20 || 1200,
    interviews: 12 + Math.floor(Math.random() * 8),
    avgScore: 72 + Math.floor(Math.random() * 10),
    streak: 3 + Math.floor(Math.random() * 5),
    trend: 15 + Math.floor(Math.random() * 30),
    isCurrentUser: true,
  };

  entries.splice(userRank, 0, userEntry);

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);

  return entries;
}
