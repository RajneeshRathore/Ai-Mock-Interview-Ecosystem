export function AnalysisResult({ result }) {
  if (!result) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Upload a resume to see analysis</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold text-lg text-slate-900 mb-6">Analysis Summary</h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-40 h-40 rounded-full border-8 border-primary-100 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full border-8 border-primary-600" style={{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${100 - result.overallScore}% 0)`}}></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{result.overallScore}%</div>
              <div className="text-xs text-slate-500">Overall Score</div>
            </div>
        </div>
        
        <div className="w-full space-y-4">
          {[
            { label: 'Skills', score: `${result.skillsScore}%`, color: 'bg-primary-600' },
            { label: 'Experience', score: `${result.experienceScore}%`, color: 'bg-green-500' },
            { label: 'Projects', score: `${result.projectsScore}%`, color: 'bg-yellow-500' },
            { label: 'Education', score: `${result.educationScore}%`, color: 'bg-primary-400' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.score}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
