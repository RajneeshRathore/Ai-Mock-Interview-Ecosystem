import { Mic, MicOff, Volume2, Loader2, CheckCircle, BrainCircuit, User, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * VoiceInterface — Premium voice interview UI.
 *
 * Layout (top to bottom):
 *   1. Avatar indicator (who is active)
 *   2. Question counter pill
 *   3. Question / AI response text
 *   4. Waveform visualizer
 *   5. Mic button + label
 *   6. Transcript card (pinned above progress bar, scrollable)
 */

const PHASE = {
  AI_SPEAKING: 'AI_SPEAKING',
  STUDENT_IDLE: 'STUDENT_IDLE',
  STUDENT_SPEAKING: 'STUDENT_SPEAKING',
  AI_THINKING: 'AI_THINKING',
  FINISHED: 'FINISHED',
};

export function VoiceInterface({ 
  interview, 
  currentQuestionIndex, 
  phase,
  isFinishing, 
  transcript, 
  aiResponseText,
  onStartSpeaking, 
  onStopSpeaking 
}) {
  const aiQuestions = interview?.messages?.filter(m => m.role === 'ai') || [];
  const waveformRef = useRef(null);
  const transcriptRef = useRef(null);

  // ─── Waveform animation ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.AI_SPEAKING && phase !== PHASE.STUDENT_SPEAKING) return;

    const interval = setInterval(() => {
      if (!waveformRef.current) return;
      const bars = waveformRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        const base = phase === PHASE.AI_SPEAKING ? 20 : 15;
        const range = phase === PHASE.AI_SPEAKING ? 45 : 55;
        bars[i].style.height = `${Math.random() * range + base}px`;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  // Reset waveform when not active
  useEffect(() => {
    if (phase === PHASE.STUDENT_IDLE || phase === PHASE.AI_THINKING || phase === PHASE.FINISHED) {
      if (!waveformRef.current) return;
      const bars = waveformRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        bars[i].style.height = '4px';
      }
    }
  }, [phase]);

  // Auto-scroll transcript to bottom as student speaks
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // ─── Display text ───────────────────────────────────────────────
  const getDisplayText = () => {
    if (phase === PHASE.AI_THINKING) return 'Evaluating your response...';
    if (phase === PHASE.FINISHED) return 'Thank you for completing the interview!';
    if (phase === PHASE.AI_SPEAKING && aiResponseText) return aiResponseText;
    return aiQuestions[currentQuestionIndex]?.content || 'Preparing your question...';
  };

  // ─── Handlers ───────────────────────────────────────────────────
  const handleMicClick = () => {
    if (phase === PHASE.STUDENT_IDLE) onStartSpeaking();
    else if (phase === PHASE.STUDENT_SPEAKING) onStopSpeaking();
  };

  const isMicDisabled = phase === PHASE.AI_SPEAKING || phase === PHASE.AI_THINKING || phase === PHASE.FINISHED || isFinishing;

  return (
    <div className="flex-1 flex flex-col items-center relative z-10 pb-16">

      {/* ═══ TOP SECTION: Avatar + Question ═══════════════════════ */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">

        {/* Avatar indicator */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            phase === PHASE.STUDENT_SPEAKING
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
              : phase === PHASE.AI_SPEAKING
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110'
              : phase === PHASE.AI_THINKING
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse'
              : 'bg-gradient-to-br from-indigo-500 to-purple-600'
          }`}>
            {phase === PHASE.STUDENT_SPEAKING ? (
              <User size={20} className="text-white" />
            ) : phase === PHASE.AI_THINKING ? (
              <Loader2 size={20} className="text-white animate-spin" />
            ) : (
              <BrainCircuit size={20} className="text-white" />
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {phase === PHASE.STUDENT_SPEAKING ? 'YOU' : phase === PHASE.AI_THINKING ? 'PROCESSING' : 'AI INTERVIEWER'}
            </div>
            <div className={`text-sm font-semibold ${
              phase === PHASE.AI_SPEAKING ? 'text-indigo-600' :
              phase === PHASE.STUDENT_SPEAKING ? 'text-emerald-600' :
              phase === PHASE.AI_THINKING ? 'text-amber-600' :
              phase === PHASE.STUDENT_IDLE ? 'text-emerald-600' :
              'text-slate-600'
            }`}>
              {phase === PHASE.AI_SPEAKING && 'Speaking...'}
              {phase === PHASE.STUDENT_IDLE && 'Your turn to answer'}
              {phase === PHASE.STUDENT_SPEAKING && 'Listening to you...'}
              {phase === PHASE.AI_THINKING && 'Analyzing your answer...'}
              {phase === PHASE.FINISHED && 'Interview Complete'}
            </div>
          </div>
        </div>

        {/* Question counter pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          Question {currentQuestionIndex + 1} of {aiQuestions.length || '—'}
        </div>

        {/* Question / AI response text */}
        <div className="text-center max-w-2xl mx-auto mb-6 px-4 overflow-y-auto max-h-[40vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          <h2 className={`text-xl font-bold leading-relaxed transition-colors duration-300 ${
            phase === PHASE.AI_THINKING ? 'text-slate-400' : 'text-slate-900'
          }`}>
            {getDisplayText()}
          </h2>
        </div>

        {/* Waveform visualizer */}
        <div ref={waveformRef} className="h-16 w-full max-w-sm flex items-center justify-center gap-[3px] mb-5">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className={`w-[3px] rounded-full transition-all duration-150 ease-out ${
                phase === PHASE.AI_SPEAKING ? 'bg-indigo-400' :
                phase === PHASE.STUDENT_SPEAKING ? 'bg-rose-400' :
                'bg-slate-200'
              }`} 
              style={{ height: '4px' }}
            ></div>
          ))}
        </div>

        {/* ─── Mic Button ──────────────────────────────────────── */}
        <div className="relative mb-2">
          {/* Glow rings */}
          {phase === PHASE.STUDENT_SPEAKING && (
            <>
              <div className="absolute inset-[-8px] bg-red-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-[-4px] bg-red-400/30 rounded-full animate-pulse"></div>
            </>
          )}
          {phase === PHASE.STUDENT_IDLE && (
            <div className="absolute inset-[-6px] bg-emerald-400/20 rounded-full animate-pulse"></div>
          )}

          <button 
            onClick={handleMicClick}
            disabled={isMicDisabled}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 relative shadow-2xl ${
              isMicDisabled
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : phase === PHASE.STUDENT_SPEAKING
                ? 'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/40 hover:scale-105 active:scale-95'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/40 hover:scale-105 active:scale-95'
            }`}
          >
            {phase === PHASE.STUDENT_SPEAKING ? (
              <Square size={26} className="relative z-10 drop-shadow-sm" fill="currentColor" />
            ) : isMicDisabled ? (
              <MicOff size={28} className="relative z-10 opacity-60" />
            ) : (
              <Mic size={28} className="relative z-10" />
            )}
          </button>
        </div>

        {/* Mic label */}
        <div className={`text-xs font-semibold tracking-wide mb-4 ${
          phase === PHASE.STUDENT_IDLE ? 'text-emerald-600' :
          phase === PHASE.STUDENT_SPEAKING ? 'text-red-500' :
          'text-slate-400'
        }`}>
          {phase === PHASE.STUDENT_IDLE && 'Tap to start speaking'}
          {phase === PHASE.STUDENT_SPEAKING && 'Tap to stop & submit answer'}
          {phase === PHASE.AI_SPEAKING && 'AI is speaking...'}
          {phase === PHASE.AI_THINKING && 'Please wait...'}
          {phase === PHASE.FINISHED && 'Complete'}
        </div>

      </div>

      {/* ═══ BOTTOM SECTION: Transcript (always visible when speaking) ═══ */}
      {(phase === PHASE.STUDENT_SPEAKING || (phase === PHASE.AI_THINKING && transcript)) && (
        <div className="w-full max-w-2xl mx-auto mb-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-1">Your Answer</div>
          <div 
            ref={transcriptRef}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm max-h-24 overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={10} className="text-emerald-600" />
              </div>
              <p className="text-slate-700 text-sm leading-relaxed flex-1">
                {transcript || (
                  <span className="text-slate-400 italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    Start speaking...
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
