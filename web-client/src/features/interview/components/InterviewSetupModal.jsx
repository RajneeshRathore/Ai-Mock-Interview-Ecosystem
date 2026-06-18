import { X, MessageSquare, Network, Loader2 } from 'lucide-react';

export function InterviewSetupModal({ selectedType, startingMode, role, setRole, difficulty, setDifficulty, language, setLanguage, handleStart, onClose }) {
  if (!selectedType) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Configure Interview</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Role</label>
            <input 
              type="text" 
              value={role}
              onChange={e => setRole(e.target.value)}
              disabled={!!startingMode}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty Level</label>
            <select 
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              disabled={!!startingMode}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
            <select 
              value={language}
              onChange={e => setLanguage(e.target.value)}
              disabled={!!startingMode}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="hi-IN">Hindi</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => handleStart('chat')}
            disabled={!!startingMode}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors flex justify-center items-center gap-2"
          >
            {startingMode === 'chat' ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
            Text Chat
          </button>
          <button 
            onClick={() => handleStart('voice')}
            disabled={!!startingMode}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary-500/30"
          >
            {startingMode === 'voice' ? <Loader2 size={18} className="animate-spin" /> : <Network size={18} />}
            Voice AI
          </button>
        </div>
      </div>
    </div>
  );
}
