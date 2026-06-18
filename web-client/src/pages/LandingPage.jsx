import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Mic, FileText, BarChart3, Shield, Zap, Check, ArrowRight, Star, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero.png';
import nervousStudentImage from '../assets/images/nervous_student.png';
import aiHelperImage from '../assets/images/ai_helper.png';
import { FadeIn } from '../components/animations/FadeIn';
import { RevealText } from '../components/animations/RevealText';
import { FloatingElement } from '../components/animations/FloatingElement';
import { CountUp } from '../components/animations/CountUp';

export default function LandingPage() {
  const [phase, setPhase] = useState('nervous');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('ai_arrives'), 3500);
    const t2 = setTimeout(() => setPhase('hero'), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const getHeroImage = () => {
    if (phase === 'nervous') return nervousStudentImage;
    if (phase === 'ai_arrives') return aiHelperImage;
    return heroImage;
  };

  const getStatusText = () => {
    if (phase === 'nervous') return "Nervous about your interview? 😰";
    if (phase === 'ai_arrives') return "Don't worry, AI is here to help! 🤖✨";
    return "Ready to ace your dream job! 🚀";
  };

  const features = [
    { icon: <Brain size={24} />, title: 'AI-Powered Questions', desc: 'Dynamic questions tailored to your role, experience level, and industry using advanced AI models.', color: 'from-violet-500 to-purple-600' },
    { icon: <Mic size={24} />, title: 'Voice Interview Mode', desc: 'Practice with real-time voice conversations, just like a real interview experience.', color: 'from-blue-500 to-cyan-500' },
    { icon: <FileText size={24} />, title: 'Resume Analysis', desc: 'Upload your resume and get AI-generated interview questions based on your actual experience.', color: 'from-emerald-500 to-teal-500' },
    { icon: <BarChart3 size={24} />, title: 'Performance Analytics', desc: 'Track your progress with detailed analytics, score trends, and improvement insights.', color: 'from-amber-500 to-orange-500' },
    { icon: <Shield size={24} />, title: 'Smart Feedback', desc: 'Get comprehensive feedback with strengths, weaknesses, and actionable improvement tips.', color: 'from-rose-500 to-pink-500' },
    { icon: <Zap size={24} />, title: 'Multi-Language Support', desc: 'Practice interviews in multiple languages to prepare for global opportunities.', color: 'from-indigo-500 to-violet-500' },
  ];

  const steps = [
    { num: '01', title: 'Choose Interview Type', desc: 'Select from Technical, HR, Behavioral, System Design, or upload a job description.', icon: '🎯' },
    { num: '02', title: 'Practice with AI', desc: 'Engage in realistic mock interviews via chat or voice with our intelligent AI interviewer.', icon: '🤖' },
    { num: '03', title: 'Get Detailed Feedback', desc: 'Receive AI-generated scores, strengths analysis, and personalized improvement areas.', icon: '📊' },
    { num: '04', title: 'Track & Improve', desc: 'Monitor your progress over time with analytics dashboards and earn achievement badges.', icon: '🚀' },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      desc: 'Perfect for getting started',
      features: ['3 interviews per month', 'Basic AI feedback', 'Score tracking', 'Email reports', 'Community support'],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-50 to-slate-100',
      border: 'border-slate-200',
    },
    {
      name: 'Pro',
      price: '19',
      period: '/month',
      desc: 'For serious job seekers',
      features: ['Unlimited interviews', 'Advanced AI analytics', 'Voice interview mode', 'Resume analysis', 'Priority support', 'Detailed performance trends', 'Export PDF reports'],
      cta: 'Start Pro Trial',
      popular: true,
      gradient: 'from-violet-50 to-purple-50',
      border: 'border-primary-200',
    },
    {
      name: 'Enterprise',
      price: '49',
      period: '/month',
      desc: 'For teams & organizations',
      features: ['Everything in Pro', 'Team management dashboard', 'Custom branding', 'API access', 'Dedicated account manager', 'Custom interview templates', 'SSO integration', 'SLA guarantee'],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-slate-50 to-slate-100',
      border: 'border-slate-200',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-[calc(100vh-5rem)]">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid-bg opacity-60"></div>
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300/20 rounded-full filter blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full filter blur-3xl animate-glow-pulse animation-delay-1000"></div>

        <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <FadeIn delay={0.1} direction="up">
              <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-800">
                <Sparkles size={14} className="animate-pulse" />
                AI-Powered Interview Preparation
              </div>
            </FadeIn>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] text-slate-900">
              <RevealText text="Practice Smart." />
              <div className="gradient-text-vivid">
                <RevealText text="Get Hired Faster." delay={0.3} />
              </div>
            </h1>
            
            <FadeIn delay={0.6} direction="up">
              <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
                AI-powered mock interviews with real-time feedback to improve your skills, boost your confidence, and land your dream job.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} direction="up">
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register" className="group relative bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2 text-lg">
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-300 transform hover:-translate-y-1 inline-block text-lg">
                  Sign In
                </Link>
              </div>
            </FadeIn>
            
            {/* Stats row */}
            <FadeIn delay={1.0} direction="up">
              <div className="pt-8 flex items-center gap-12 border-t border-slate-100">
                <div>
                   <div className="text-3xl font-display font-bold text-slate-900"><CountUp target={10} suffix="K+" /></div>
                   <div className="text-sm text-slate-500 mt-1">Happy Users</div>
                </div>
                <div>
                   <div className="text-3xl font-display font-bold gradient-text"><CountUp target={50} suffix="K+" /></div>
                   <div className="text-sm text-slate-500 mt-1">Interviews Done</div>
                </div>
                <div>
                   <div className="text-3xl font-display font-bold text-slate-900"><CountUp target={95} suffix="%" /></div>
                   <div className="text-sm text-slate-500 mt-1">Satisfaction</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Hero image */}
          <div className="flex-1 relative w-full max-w-lg mx-auto">
             <FadeIn delay={0.4} direction="left" duration={0.8} className="w-full">
               <FloatingElement yOffset={15} duration={6}>
                 <div className="w-full aspect-square bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-4 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl border border-white/50 glow-border">
                    
                    {/* Dynamic Status Text */}
                    <div className="absolute top-8 z-20 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-slate-100">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={phase}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="font-bold text-slate-800 text-sm"
                        >
                          {getStatusText()}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Dynamic Image */}
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-gradient-to-br from-primary-50 to-indigo-50 mt-12">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={phase}
                          src={getHeroImage()}
                          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full object-cover"
                          alt="AI Interview Sequence"
                        />
                      </AnimatePresence>
                    </div>
                    
                 </div>
               </FloatingElement>
             </FadeIn>
             
             {/* Decorative Blur Orbs */}
             <FloatingElement yOffset={30} duration={6} delay={1} className="absolute -top-10 -right-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></FloatingElement>
             <FloatingElement yOffset={-30} duration={7} delay={0.5} className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></FloatingElement>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-slate-50/80 relative">
        <div className="absolute inset-0 dot-grid-bg opacity-30"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium border border-primary-100 mb-6">
              <Star size={14} />
              Powerful Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">
              Everything you need to <span className="gradient-text-vivid">ace your interview</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven interview techniques to give you the ultimate preparation experience.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1} direction="up">
                <div className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-primary-200 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-indigo-50/0 group-hover:from-primary-50/50 group-hover:to-indigo-50/30 transition-all duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS SECTION ═══════════════ */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-8">
          <FadeIn direction="up" className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100 mb-6">
              <Zap size={14} />
              Simple Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">
              How it <span className="gradient-text-vivid">works</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Get started in minutes. Our streamlined process makes interview preparation effortless and effective.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 z-0"></div>
            
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.15} direction="up">
                <div className="relative text-center group">
                  {/* Step number circle */}
                  <div className="relative z-10 w-32 h-32 mx-auto mb-8">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-50 to-indigo-50 border-2 border-primary-100 group-hover:border-primary-300 flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-100/50">
                      <div className="text-center">
                        <div className="text-4xl mb-1">{step.icon}</div>
                        <div className="text-xs font-bold text-primary-400 tracking-wider">{step.num}</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING SECTION ═══════════════ */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50/80 to-white relative">
        <div className="absolute inset-0 dot-grid-bg opacity-20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-100 mb-6">
              <Sparkles size={14} />
              Pricing Plans
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4">
              Choose your <span className="gradient-text-vivid">perfect plan</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.15} direction="up">
                <div className={`relative rounded-3xl p-8 border-2 ${plan.popular ? 'border-primary-400 shadow-2xl shadow-primary-100/50 scale-105' : plan.border + ' shadow-sm hover:shadow-lg'} bg-gradient-to-b ${plan.gradient} transition-all duration-300 hover:-translate-y-1 flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
                      Most Popular ✨
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-500 text-sm">{plan.desc}</p>
                  </div>

                  <div className="mb-8">
                    <span className="text-5xl font-display font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-400 ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-600' : 'text-emerald-500'}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5' 
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-primary-200 hover:text-primary-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-violet-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2Mmgt MnYtMnptLTQgMGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <FadeIn direction="up">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to ace your next interview?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have improved their interview skills with our AI-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="group bg-white text-primary-700 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2">
                Start Practicing Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                AI Mock Interview
              </div>
              <p className="text-sm leading-relaxed">Empowering job seekers with AI-driven interview preparation for a successful career.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} AI Mock Interview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
