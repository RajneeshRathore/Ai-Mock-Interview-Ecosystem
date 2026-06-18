import { Link } from 'react-router-dom';

export function RecentInterviews({ interviews }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Interviews</h3>
         <Link to="/dashboard/reports" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1 group">
           View All
           <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
         </Link>
      </div>
      <div className="space-y-3">
         {interviews.length === 0 ? (
           <div className="text-center text-slate-400 dark:text-slate-500 py-8">
             <div className="text-3xl mb-2">📋</div>
             <p className="text-sm">No interviews completed yet.</p>
             <Link to="/dashboard/interviews/new" className="text-primary-600 text-sm font-medium hover:underline mt-2 inline-block">Start your first interview →</Link>
           </div>
         ) : (
           interviews.map((item, i) => (
             <div 
               key={i} 
               className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
             >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold uppercase text-sm group-hover:scale-105 transition-transform">
                   {item.role.charAt(0)}
                 </div>
                 <div>
                   <div className="font-medium text-slate-900 dark:text-white text-sm">{item.role}</div>
                   <div className="text-xs text-slate-400">{item.date}</div>
                 </div>
               </div>
               <div className={`font-bold text-sm ${item.color}`}>{item.score}%</div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
