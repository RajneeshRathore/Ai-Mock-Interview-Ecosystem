import { useState } from 'react';
import { Heart, Bookmark, ArrowRight, Code2, MessageSquare, Cpu, Lightbulb, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categoryConfig = {
  dsa: {
    label: 'DSA',
    Icon: Code2,
    bg: 'radial-gradient(ellipse at 20% 20%, #1e1b4b 0%, #0f0f1a 50%, #1a0a2e 100%)',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    accentClass: 'text-indigo-400',
    tagClass: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
    btnClass: 'from-indigo-500 to-purple-600',
    btnShadow: 'shadow-indigo-500/30',
    orb1: 'bg-indigo-600/25',
    orb2: 'bg-purple-700/20',
    likeActive: 'text-indigo-400',
    bookmarkActive: 'text-indigo-300',
  },
  behavioral: {
    label: 'Behavioral',
    Icon: MessageSquare,
    bg: 'radial-gradient(ellipse at 20% 20%, #064e3b 0%, #0f1a0f 50%, #022c22 100%)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    accentClass: 'text-emerald-400',
    tagClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
    btnClass: 'from-emerald-500 to-teal-600',
    btnShadow: 'shadow-emerald-500/30',
    orb1: 'bg-emerald-600/25',
    orb2: 'bg-teal-700/20',
    likeActive: 'text-emerald-400',
    bookmarkActive: 'text-emerald-300',
  },
  system: {
    label: 'System Design',
    Icon: Cpu,
    bg: 'radial-gradient(ellipse at 20% 20%, #2e1065 0%, #0f0a1a 50%, #1a0545 100%)',
    badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    accentClass: 'text-purple-400',
    tagClass: 'bg-purple-500/15 text-purple-300 border border-purple-500/20',
    btnClass: 'from-purple-500 to-violet-600',
    btnShadow: 'shadow-purple-500/30',
    orb1: 'bg-purple-600/25',
    orb2: 'bg-violet-700/20',
    likeActive: 'text-purple-400',
    bookmarkActive: 'text-purple-300',
  },
  tips: {
    label: 'Quick Tips',
    Icon: Lightbulb,
    bg: 'radial-gradient(ellipse at 20% 20%, #451a03 0%, #1a0f00 50%, #3b1200 100%)',
    badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    accentClass: 'text-amber-400',
    tagClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
    btnClass: 'from-amber-500 to-orange-600',
    btnShadow: 'shadow-amber-500/30',
    orb1: 'bg-amber-600/25',
    orb2: 'bg-orange-700/20',
    likeActive: 'text-amber-400',
    bookmarkActive: 'text-amber-300',
  },
};

export function ReelCard({ reel, index, total, isActive }) {
  const navigate = useNavigate();
  const config = categoryConfig[reel.category];
  const { Icon } = config;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: config.bg }}
    >
      {/* Decorative orbs */}
      <div className={`absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full blur-3xl pointer-events-none ${config.orb1}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-64 h-64 rounded-full blur-3xl pointer-events-none ${config.orb2}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />

      {/* Progress indicator (right side) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === index
                ? 'w-1.5 h-6 bg-white'
                : 'w-1 h-2 bg-white/25'
            }`}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-6 flex flex-col h-full justify-between">

        {/* Top: Category + counter */}
        <div className="flex items-center justify-between pt-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${config.badgeClass}`}>
            <Icon size={13} />
            {config.label}
          </div>
          <span className="text-xs text-white/30 font-mono">{index + 1} / {total}</span>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 flex flex-col justify-center py-4 gap-5">
          {/* Title block */}
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              {reel.title}
            </h2>
            <p className={`text-base font-medium mt-1 ${config.accentClass}`}>
              {reel.subtitle}
            </p>
          </div>

          {/* Explanation */}
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            {reel.explanation}
          </p>

          {/* Content block */}
          {reel.type === 'code' && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <span className="ml-2 text-[10px] text-white/30 font-mono">example.js</span>
              </div>
              <pre className="px-4 py-3 text-xs text-slate-200 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                {reel.code}
              </pre>
            </div>
          )}

          {reel.type === 'bullets' && (
            <div className="space-y-2.5">
              {reel.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-slate-900 ${
                    reel.category === 'behavioral' ? 'bg-emerald-400' :
                    reel.category === 'system' ? 'bg-purple-400' : 'bg-white'
                  }`}>{i + 1}</span>
                  <p className="text-slate-200 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          )}

          {reel.type === 'checklist' && (
            <div className="space-y-2">
              {reel.points.map((point, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/8">
                  <CheckSquare size={15} className={config.accentClass} />
                  <p className="text-slate-200 text-sm">{point}</p>
                </div>
              ))}
            </div>
          )}

          {reel.type === 'concept' && (
            <div className="grid grid-cols-1 gap-2.5">
              {reel.points.map((point, i) => (
                <div key={i} className={`px-4 py-3 rounded-xl border ${config.tagClass} bg-white/5`}>
                  <p className="text-sm text-slate-200 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {reel.tags && (
            <div className="flex flex-wrap gap-2">
              {reel.tags.map(tag => (
                <span key={tag} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${config.tagClass}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Action bar */}
        <div className="flex items-center justify-between pb-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-5">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ${
                liked ? config.likeActive : 'text-white/50 hover:text-white'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm font-semibold">{likes}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(b => !b)}
              className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ${
                bookmarked ? config.bookmarkActive : 'text-white/50 hover:text-white'
              }`}
            >
              <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
              <span className="text-xs font-semibold">{bookmarked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="text-white/50 hover:text-white text-xs font-semibold transition-all duration-200 hover:scale-110 active:scale-95"
            >
              {copied ? '✓ Copied!' : '↗ Share'}
            </button>
          </div>

          {/* Practice CTA */}
          <button
            onClick={() => navigate('/dashboard/interviews/new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.btnClass} text-white text-sm font-bold shadow-lg ${config.btnShadow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95`}
          >
            Practice Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
