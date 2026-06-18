import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100/50' 
          : 'bg-transparent'
      }`}>
        <div className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-800 group">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">AI</div>
             <span className="font-display">AI Mock Interview</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="nav-link-glow text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors relative"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 px-4 py-2.5 rounded-xl transition-all hover:bg-primary-50">Login</Link>
            <Link to="/register" className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl">
            <div className="px-8 py-6 space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="block text-sm font-medium text-slate-600 hover:text-primary-600 py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <Link to="/login" className="block text-center text-sm font-semibold text-slate-700 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block text-center bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
