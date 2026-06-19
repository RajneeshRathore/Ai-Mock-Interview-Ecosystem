import { useState, useEffect } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { getDashboardStats } from '../services/analyticsService';
import { StatsGrid } from '../features/dashboard/components/StatsGrid';
import { RecentInterviews } from '../features/dashboard/components/RecentInterviews';
import { TrendChart } from '../features/analytics/components/TrendChart';
import { BadgesGrid } from '../features/dashboard/components/BadgesGrid';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, FileText, BarChart3, ArrowRight, Briefcase, Map, Users } from 'lucide-react';

import Skeleton from '../components/loaders/Skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      getDashboardStats(user.id).then(res => setStats(res.data));
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { title: 'Start Interview', desc: 'Begin a new AI mock interview', icon: <Video size={22} />, path: '/dashboard/interviews/new', gradient: 'from-violet-500 to-purple-600' },
    { title: 'Job Tracker', desc: 'Track your applications', icon: <Briefcase size={22} />, path: '/dashboard/applications', gradient: 'from-emerald-500 to-teal-500' },
    { title: 'HR Prep', desc: 'Practice behavioral questions', icon: <Users size={22} />, path: '/dashboard/hr-prep', gradient: 'from-amber-500 to-orange-500' },
  ];

  if (!stats) return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );

  // Format recent interviews for the component
  const formattedRecent = stats.recentInterviews.map(i => ({
    role: i.role,
    date: new Date(i.date).toLocaleDateString(),
    score: i.score,
    color: i.score >= 80 ? 'text-green-500' : i.score >= 60 ? 'text-yellow-500' : 'text-red-500'
  }));

  return (
    <div className="space-y-8">
       {/* Greeting */}
       <motion.div
         initial={{ opacity: 0, y: -15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
       >
         <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
           {getGreeting()}, {user?.name.split(' ')[0]}! 👋
         </h2>
         <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your interview preparation progress.</p>
       </motion.div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         {quickActions.map((action, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
           >
             <Link
               to={action.path}
               className="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
             >
               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                 {action.icon}
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-semibold text-slate-900 dark:text-white text-sm">{action.title}</div>
                 <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.desc}</div>
               </div>
               <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
             </Link>
           </motion.div>
         ))}
       </div>

       {/* Stats Grid */}
       <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5, delay: 0.3 }}
       >
         <StatsGrid stats={stats} />
       </motion.div>

       {/* Chart + Recent + Badges */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
             <TrendChart data={stats.performanceData} />
          </motion.div>
          
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <RecentInterviews interviews={formattedRecent} />
            <BadgesGrid />
          </motion.div>
       </div>
    </div>
  );
}
