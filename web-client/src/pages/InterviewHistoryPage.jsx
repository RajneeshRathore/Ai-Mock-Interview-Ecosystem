import { useState, useEffect } from 'react';
import { getInterviews } from '../services/interviewService';
import { Calendar, Brain, Activity, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton from '../components/loaders/Skeleton';

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState(null);

  useEffect(() => {
    getInterviews().then(res => setInterviews(res)).catch(() => setInterviews([]));
  }, []);

  if (!interviews) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-down opacity-0 animate-fill-forwards">
        <h2 className="text-2xl font-bold text-slate-900">Interview History</h2>
        <p className="text-slate-500 mt-1">Review your past interview sessions.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Brain className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No interviews yet</h3>
          <p className="text-slate-500 mt-2">Start a new mock interview to see your history here.</p>
          <Link to="/dashboard/interviews/new" className="inline-block mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Start Practice
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 animate-fade-in-up opacity-0 animation-delay-100 animate-fill-forwards">
          {interviews.map((interview, idx) => (
            <div key={interview._id || idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:border-primary-200 transition-colors group">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{interview.title || 'Technical Interview'}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(interview.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Activity size={16} /> {interview.experienceLevel || 'Medium'}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {interview.status || 'Completed'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to={`/dashboard/reports?session=${interview._id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  View Report
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
