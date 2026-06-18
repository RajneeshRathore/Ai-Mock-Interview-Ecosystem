import { useEffect, useState } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { getDashboardStats } from '../services/analyticsService';
import { StatsGrid } from '../features/dashboard/components/StatsGrid';
import { TrendChart } from '../features/analytics/components/TrendChart';
import { SkillRadar } from '../features/analytics/components/SkillRadar';

import Skeleton from '../components/loaders/Skeleton';

export default function ProgressAnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    hoursPracticed: 0,
    badgesEarned: 0,
    performanceData: [],
    recentInterviews: []
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
      getDashboardStats(user.id, timeRange).then(res => {
        if (res.data) setStats(res.data);
        setLoading(false);
      });
    }
  }, [user, timeRange]);

  const skillData = stats.skillData || [];

  if (loading) return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end animate-fade-in-down opacity-0 animate-fill-forwards">
         <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Progress & Analytics</h2>
           <p className="text-slate-500 mt-1">Track your improvement over time.</p>
         </div>
         <select 
           value={timeRange}
           onChange={e => setTimeRange(e.target.value)}
           className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
         >
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="all">All Time</option>
         </select>
       </div>

       <div className="animate-fade-in-up opacity-0 animation-delay-100 animate-fill-forwards">
         <StatsGrid stats={stats} />
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="animate-fade-in-up opacity-0 animation-delay-200 animate-fill-forwards">
           <TrendChart data={stats.performanceData} />
         </div>
         <div className="animate-fade-in-up opacity-0 animation-delay-300 animate-fill-forwards">
           <SkillRadar data={skillData} />
         </div>
      </div>
    </div>
  );
}
