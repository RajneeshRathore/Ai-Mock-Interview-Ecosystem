import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function TrendChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white">Score Trend</h3>
          <p className="text-sm text-slate-400 mt-1">Your performance over time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"></div>
          <span className="text-xs text-slate-500">Score</span>
        </div>
      </div>
      <div className="h-64 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data}>
             <defs>
               <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                 <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.1} />
                 <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
               </linearGradient>
               <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                 <stop offset="0%" stopColor="#7c3aed" />
                 <stop offset="100%" stopColor="#6366f1" />
               </linearGradient>
             </defs>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
             <XAxis 
               dataKey="name" 
               axisLine={false} 
               tickLine={false} 
               tick={{fill: '#94a3b8', fontSize: 12}} 
               dy={10} 
             />
             <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{fill: '#94a3b8', fontSize: 12}} 
               dx={-10} 
               domain={[0, 100]} 
             />
             <Tooltip 
               contentStyle={{ 
                 borderRadius: '16px', 
                 border: 'none', 
                 boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                 padding: '12px 16px',
                 background: 'white',
               }}
               cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
               labelStyle={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
               itemStyle={{ color: '#7c3aed' }}
             />
             <Area 
               type="monotone" 
               dataKey="score" 
               stroke="url(#lineGradient)" 
               strokeWidth={3} 
               fill="url(#scoreGradient)"
               dot={{r: 5, fill: '#7c3aed', strokeWidth: 3, stroke: '#fff'}} 
               activeDot={{r: 7, fill: '#7c3aed', strokeWidth: 3, stroke: '#fff'}} 
             />
           </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
