import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, Award, MessageSquare, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated notifications — in production these would come from API/WebSocket
const generateNotifications = () => [
  {
    id: 1,
    type: 'feedback',
    title: 'Feedback Ready',
    message: 'Your interview feedback for "Frontend Developer" is ready to review.',
    time: '2 min ago',
    read: false,
    icon: <MessageSquare size={16} />,
    color: 'from-blue-500 to-cyan-500',
    link: '/dashboard/reports',
  },
  {
    id: 2,
    type: 'badge',
    title: 'Badge Earned! 🏆',
    message: 'Congratulations! You earned the "First Steps" badge.',
    time: '1 hour ago',
    read: false,
    icon: <Award size={16} />,
    color: 'from-amber-500 to-orange-500',
    link: '/dashboard',
  },
  {
    id: 3,
    type: 'improvement',
    title: 'Score Improved',
    message: 'Your average score improved by 12% this week. Keep it up!',
    time: '3 hours ago',
    read: true,
    icon: <TrendingUp size={16} />,
    color: 'from-emerald-500 to-teal-500',
    link: '/dashboard/analytics',
  },
  {
    id: 4,
    type: 'learning',
    title: 'New Topic Available',
    message: 'Check out the new "Dynamic Programming" learning module.',
    time: '1 day ago',
    read: true,
    icon: <BookOpen size={16} />,
    color: 'from-violet-500 to-purple-500',
    link: '/dashboard/learn',
  },
  {
    id: 5,
    type: 'feedback',
    title: 'Weekly Summary',
    message: 'You completed 3 interviews this week. View your progress report.',
    time: '2 days ago',
    read: true,
    icon: <MessageSquare size={16} />,
    color: 'from-blue-500 to-cyan-500',
    link: '/dashboard/analytics',
  },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(generateNotifications);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 relative group"
      >
        <Bell size={18} className={`text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform ${open ? 'text-primary-600' : ''}`} />
        {unreadCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[10px] text-white font-bold">{unreadCount}</span>
          </div>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute right-0 top-14 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={32} className="text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    to={notif.link}
                    onClick={() => { markAsRead(notif.id); setOpen(false); }}
                    className={`block px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 relative group/item ${
                      !notif.read ? 'bg-primary-50/30 dark:bg-primary-950/10' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                        {notif.icon}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{notif.title}</span>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={(e) => removeNotification(e, notif.id)}
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1"
                      >
                        <X size={12} className="text-slate-400" />
                      </button>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <button
                  onClick={() => { setNotifications([]); }}
                  className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors w-full text-center"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
