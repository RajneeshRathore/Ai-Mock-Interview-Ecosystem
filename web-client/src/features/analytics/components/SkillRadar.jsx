import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function SkillRadar({ data }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6">Skill Performance</h3>
      <div className="h-64 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
             <PolarGrid stroke="#e2e8f0" />
             <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12}} />
             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
             <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
             <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
           </RadarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
