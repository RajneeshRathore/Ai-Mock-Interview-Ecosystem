import { CheckCircle, XCircle } from 'lucide-react';

export function FeedbackLists() {
  const strengths = [
    'Good understanding of core concepts',
    'Clear communication when explaining technical terms',
    'Structured problem solving approach'
  ];

  const improvements = [
    'Work on system design concepts specifically scaling',
    'Practice more dynamic programming coding problems',
    'Improve confidence when answering unexpected questions'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Strengths
         </h3>
         <ul className="space-y-4">
            {strengths.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                 <span className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✓</span>
                 <span className="text-slate-700">{text}</span>
              </li>
            ))}
         </ul>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <XCircle className="text-red-500" />
            Areas to Improve
         </h3>
         <ul className="space-y-4">
            {improvements.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                 <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✕</span>
                 <span className="text-slate-700">{text}</span>
              </li>
            ))}
         </ul>
      </div>
    </div>
  );
}
