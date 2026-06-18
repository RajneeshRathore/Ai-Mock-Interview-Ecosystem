import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, MessageSquare, Network, Settings, FileUp } from 'lucide-react';
import { startInterview } from '../services/interviewService';
import { useAuth } from '../app/providers/AuthProvider';
import { InterviewSetupModal } from '../features/interview/components/InterviewSetupModal';

export default function InterviewTypePage() {
  const [selectedType, setSelectedType] = useState(null);
  const [role, setRole] = useState('Frontend Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('en-US');
  const [startingMode, setStartingMode] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice technical questions',
      icon: <Code size={24} className="text-primary-600" />,
      color: 'bg-primary-50'
    },
    {
      id: 'hr',
      title: 'HR Interview',
      description: 'Practice HR based questions',
      icon: <Users size={24} className="text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Practice behavioral questions',
      icon: <MessageSquare size={24} className="text-yellow-500" />,
      color: 'bg-yellow-50'
    },
    {
      id: 'system_design',
      title: 'System Design',
      description: 'Practice system design',
      icon: <Network size={24} className="text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      id: 'custom',
      title: 'Custom Interview',
      description: 'Create your own interview',
      icon: <Settings size={24} className="text-slate-600" />,
      color: 'bg-slate-50'
    },
    {
      id: 'jd',
      title: 'Upload Job Description',
      description: 'Generate interview from JD',
      icon: <FileUp size={24} className="text-green-500" />,
      color: 'bg-green-50'
    }
  ];

  const handleStart = async (mode) => {
    if (!user) return;
    setStartingMode(mode);
    try {
      const res = await startInterview(user.id, selectedType.id, role, difficulty);
      const interviewId = res._id || res.id;
      if (mode === 'chat') {
        navigate(`/dashboard/interviews/chat?id=${interviewId}&lang=${language}`);
      } else {
        navigate(`/dashboard/interviews/voice?id=${interviewId}&lang=${language}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStartingMode(null);
    }
  };

  return (
    <div className="space-y-6 relative">
       <div className="animate-fade-in-down opacity-0 animate-fill-forwards">
         <h2 className="text-2xl font-bold text-slate-900">Choose Interview Type</h2>
         <p className="text-slate-500">Select the type of interview you want to practice.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewTypes.map((type, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedType(type)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary-200 animate-zoom-in opacity-0 animate-fill-forwards"
              style={{ animationDelay: `${i * 100}ms` }}
            >
               <div className={`w-14 h-14 rounded-xl ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {type.icon}
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2">{type.title}</h3>
               <p className="text-slate-500 text-sm">{type.description}</p>
            </div>
          ))}
       </div>

       <InterviewSetupModal 
         selectedType={selectedType}
         startingMode={startingMode}
         role={role}
         setRole={setRole}
         difficulty={difficulty}
         setDifficulty={setDifficulty}
         language={language}
         setLanguage={setLanguage}
         handleStart={handleStart}
         onClose={() => !startingMode && setSelectedType(null)}
       />
    </div>
  );
}
