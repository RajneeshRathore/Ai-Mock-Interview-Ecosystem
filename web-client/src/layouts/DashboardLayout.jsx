import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, LogOut, Video, BarChart2, FileBarChart, UserCircle, Moon, Sun, Bell, BookOpen, Building2, MessageSquare, Map, Briefcase, Trophy, ClipboardCheck } from "lucide-react";
import { NotificationDropdown } from "../components/common/NotificationDropdown";
import { useAuth } from "../app/providers/AuthProvider";
import { useState, useEffect } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Roadmap', path: '/dashboard/roadmap', icon: <Map size={20} /> },
    { name: 'Interviews', path: '/dashboard/interviews/new', icon: <Video size={20} /> },
    { name: 'HR Prep', path: '/dashboard/hr-prep', icon: <Users size={20} /> },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: <FileText size={20} /> },
    { name: 'Reports', path: '/dashboard/reports', icon: <FileBarChart size={20} /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart2 size={20} /> },
    { name: 'History', path: '/dashboard/interviews/history', icon: <FileText size={20} /> },
    { name: 'Learn DSA', path: '/dashboard/learn', icon: <BookOpen size={20} /> },
    { name: 'Company Prep', path: '/dashboard/companies', icon: <Building2 size={20} /> },
    { name: 'Job Tracker', path: '/dashboard/applications', icon: <Briefcase size={20} /> },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Checklist', path: '/dashboard/checklist', icon: <ClipboardCheck size={20} /> },
    { name: 'Community', path: '/dashboard/community', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 flex flex-col relative overflow-hidden">
        {/* Subtle gradient orb */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
        
        <Link to="/" className="p-6 flex items-center gap-3 text-white font-bold text-xl hover:text-primary-400 transition-colors relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
             <Video size={18} className="text-white" />
          </div>
          <span className="font-display">AI Mock</span>
        </Link>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard');
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                  isActive 
                    ? 'bg-primary-600/15 text-primary-400 shadow-sm' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary-400 to-indigo-500 rounded-r-full"></div>
                )}
                <span className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800/50 space-y-1 relative z-10">
           {/* Dark Mode Toggle */}
           <button 
             onClick={() => setDarkMode(!darkMode)} 
             className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 text-slate-400 hover:text-yellow-400 group"
           >
             <span className="group-hover:scale-110 transition-transform duration-200">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </span>
             <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
           </button>
           
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all duration-200 text-slate-400 hover:text-red-400 group">
            <span className="group-hover:scale-110 transition-transform duration-200">
              <LogOut size={20} />
            </span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-8 z-10">
           <div className="font-medium text-slate-800 dark:text-slate-200">
             <span className="text-lg">Hello, <span className="font-semibold">{user?.name || 'User'}</span>! 👋</span>
           </div>
           <div className="flex items-center gap-3">
              <NotificationDropdown />
              
              {/* Profile */}
              <Link to="/dashboard/profile" className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/30 dark:to-indigo-900/30 flex items-center justify-center hover:shadow-md transition-all duration-200 ring-2 ring-transparent hover:ring-primary-200 dark:hover:ring-primary-800" title="Profile">
                <UserCircle size={20} className="text-primary-600 dark:text-primary-400" />
              </Link>
              
              {/* New Interview */}
              <Link to="/dashboard/interviews/new" className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2">
                <span>+</span> New Interview
              </Link>
           </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8 dark:bg-slate-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
