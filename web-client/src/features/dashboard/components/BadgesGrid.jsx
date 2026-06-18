import { useEffect, useState } from 'react';
import { getMyBadges } from '../../../services/userService';
import Skeleton from '../../../components/loaders/Skeleton';
import { motion } from 'framer-motion';

export function BadgesGrid() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBadges()
      .then(data => setBadges(data))
      .catch(err => console.error('Failed to load badges:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
         <Skeleton className="h-6 w-1/3 mb-4" />
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
         </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">🏆 Recent Badges</h3>
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {badges.slice(0, 4).map((badge, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-0.5 cursor-default overflow-hidden"
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 shimmer-effect"></div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                <div className="font-bold text-slate-900 dark:text-amber-100 text-xs">{badge.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">{badge.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-slate-400 dark:text-slate-500 text-sm">No badges yet. Complete interviews to earn your first!</p>
        </div>
      )}
    </div>
  );
}
