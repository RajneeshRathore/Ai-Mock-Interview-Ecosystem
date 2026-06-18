export function ScoreBreakdown({ report }) {
  const items = [
    { label: 'Technical Skills', score: Math.min(100, report.score + 5), color: 'bg-green-500' },
    { label: 'Communication', score: Math.min(100, report.score + 2), color: 'bg-primary-500' },
    { label: 'Problem Solving', score: report.score, color: 'bg-blue-500' },
    { label: 'Confidence', score: Math.max(0, report.score - 5), color: 'bg-yellow-500' }
  ];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
       <h3 className="font-bold text-slate-900 mb-6">Score Breakdown</h3>
       <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i}>
               <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-900">{item.score}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}
