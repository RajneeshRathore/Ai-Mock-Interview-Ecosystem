import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../app/providers/AuthProvider';
import { getInterviewById, answerQuestion, finishInterview } from '../services/interviewService';
import { VoiceInterface } from '../features/interview/components/VoiceInterface';

import Skeleton from '../components/loaders/Skeleton';

/**
 * Voice Interview Page — State Machine
 * 
 * States:
 *   AI_SPEAKING   → AI is speaking the question aloud. Student must wait.
 *   STUDENT_IDLE  → AI finished speaking. Student sees mic button, but it's muted.
 *   STUDENT_SPEAKING → Student has tapped mic to unmute and is speaking.
 *   AI_THINKING   → Student tapped mic again to finish. Answer sent to backend. Waiting for AI response.
 *   FINISHED      → Interview is over.
 */
const PHASE = {
  AI_SPEAKING: 'AI_SPEAKING',
  STUDENT_IDLE: 'STUDENT_IDLE',
  STUDENT_SPEAKING: 'STUDENT_SPEAKING',
  AI_THINKING: 'AI_THINKING',
  FINISHED: 'FINISHED',
};

export default function VoiceInterviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const interviewId = searchParams.get('id');
  const language = searchParams.get('lang') || 'en-US';

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [phase, setPhase] = useState(PHASE.AI_SPEAKING);
  const [aiResponseText, setAiResponseText] = useState('');

  const MAX_QUESTIONS = 5;
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  // ─── Speak utility ──────────────────────────────────────────────
  const speak = useCallback((text, onDone) => {
    if (!('speechSynthesis' in window)) {
      onDone?.();
      return;
    }

    // Cancel any prior speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Keep a strong reference so Chrome doesn't garbage-collect it
    utteranceRef.current = utterance;

    utterance.onend = () => {
      utteranceRef.current = null;
      onDone?.();
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      onDone?.();
    };

    // Chrome bug workaround: speechSynthesis can pause itself on long text.
    // We periodically resume it.
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAlive);
        return;
      }
      window.speechSynthesis.resume();
    }, 5000);

    utterance.onend = () => {
      clearInterval(keepAlive);
      utteranceRef.current = null;
      onDone?.();
    };
    utterance.onerror = () => {
      clearInterval(keepAlive);
      utteranceRef.current = null;
      onDone?.();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // ─── Fetch interview session on mount ───────────────────────────
  useEffect(() => {
    if (!interviewId) return;

    getInterviewById(interviewId).then(session => {
      setInterview(session);

      const aiQuestionsCount = session.messages.filter(m => m.role === 'ai').length;
      setCurrentQuestionIndex(Math.max(0, aiQuestionsCount - 1));

      // Speak the latest AI question
      const lastMessage = session.messages[session.messages.length - 1];
      if (lastMessage && lastMessage.role === 'ai') {
        setPhase(PHASE.AI_SPEAKING);
        setAiResponseText(lastMessage.content);
        speak(lastMessage.content, () => {
          setPhase(PHASE.STUDENT_IDLE);
        });
      } else {
        setPhase(PHASE.STUDENT_IDLE);
      }
    }).catch(err => {
      console.error("Failed to fetch interview:", err);
    });
  }, [interviewId, speak]);

  // ─── Timers ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
      setQuestionTimer(qt => qt + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  // ─── Start recording (student taps mic to unmute) ───────────────
  const handleStartSpeaking = useCallback(() => {
    if (phase !== PHASE.STUDENT_IDLE) return;

    // Cancel any leftover AI speech
    window.speechSynthesis.cancel();

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    let fullTranscript = '';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(fullTranscript + interim);
    };

    recognition.onerror = (e) => {
      // The 'aborted' error is expected when we manually stop recording
      if (e.error === 'aborted') return;
      console.error('Speech recognition error:', e.error);
      // If it's a no-speech error, just keep listening
      if (e.error === 'no-speech') return;
    };

    recognition.onend = () => {
      // Auto-restart if we're still in STUDENT_SPEAKING phase (browser can kill recognition)
      // We don't auto-restart — the student will tap the button to stop.
    };

    recognitionRef.current = recognition;
    recognition.start();

    setTranscript('');
    setPhase(PHASE.STUDENT_SPEAKING);
  }, [phase]);

  // ─── Stop recording (student taps mic again to mute & submit) ──
  const handleStopSpeaking = useCallback(async () => {
    if (phase !== PHASE.STUDENT_SPEAKING) return;

    // Stop speech recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      recognitionRef.current = null;
    }

    const finalTranscript = transcript.trim() || '';

    if (!finalTranscript) {
      // Student didn't say anything — go back to idle
      setPhase(PHASE.STUDENT_IDLE);
      setTranscript('');
      return;
    }

    const newAnswers = [...answers, finalTranscript];
    setAnswers(newAnswers);
    setPhase(PHASE.AI_THINKING);

    try {
      const result = await answerQuestion(interviewId, finalTranscript);

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < MAX_QUESTIONS) {
        setCurrentQuestionIndex(nextIndex);
        setQuestionTimer(0);
        setAiResponseText(result.nextQuestion);
        setTranscript('');
        setPhase(PHASE.AI_SPEAKING);

        speak(result.nextQuestion, () => {
          setPhase(PHASE.STUDENT_IDLE);
        });
      } else {
        // Last question — wrap up
        setPhase(PHASE.AI_SPEAKING);
        setAiResponseText("Thank you, that concludes our interview. Let me analyze your responses.");
        speak("Thank you, that concludes our interview. Let me analyze your responses.", async () => {
          setPhase(PHASE.FINISHED);
          await handleEndInterview(newAnswers);
        });
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setAiResponseText("I'm sorry, there was a technical issue. Please try answering again.");
      setPhase(PHASE.AI_SPEAKING);
      speak("I'm sorry, there was a technical issue. Please try answering again.", () => {
        setTranscript('');
        setPhase(PHASE.STUDENT_IDLE);
      });
    }
  }, [phase, transcript, answers, interviewId, currentQuestionIndex, speak]);

  // ─── End interview ──────────────────────────────────────────────
  const handleEndInterview = async (finalAnswers = answers) => {
    if (!user || !interview) return;
    setIsFinishing(true);
    try {
      await finishInterview(interview._id || interview.id, timer);
      navigate('/dashboard/reports');
    } catch (e) {
      console.error(e);
      setIsFinishing(false);
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (!interview) return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden animate-in fade-in duration-500">
      <div className="flex justify-between items-center w-full mb-12">
         <Skeleton className="h-10 w-48 rounded-lg" />
         <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
         <Skeleton className="h-20 w-3/4 rounded-xl" />
         <Skeleton className="h-32 w-full max-w-xl rounded-xl" />
         <Skeleton className="h-24 w-24 rounded-full mt-4" />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
       {/* Ambient background blobs */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

       {/* ─── Header ─────────────────────────────────────────────── */}
       <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all hover:shadow-sm active:scale-95">
               <ArrowLeft size={20} className="text-slate-600" />
             </button>
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">AI</div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">Voice Interview</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${phase === PHASE.FINISHED ? 'bg-slate-300' : 'bg-green-400 animate-pulse'}`}></span>
                    <span className="text-[11px] text-slate-400 font-medium">{phase === PHASE.FINISHED ? 'Ended' : 'Live Session'}</span>
                  </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {questionTimer >= 60 && phase === PHASE.STUDENT_SPEAKING && (
               <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold animate-pulse">
                 Please wrap up your answer...
               </div>
             )}
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-mono text-slate-700 text-sm font-semibold">
               <Clock size={15} className="text-slate-500" />
               <span>{formatTime(timer)}</span>
             </div>
             <button 
               onClick={() => handleEndInterview()}
               disabled={isFinishing || phase === PHASE.AI_THINKING || answers.length === 0}
               className="px-5 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 active:scale-95"
             >
               {isFinishing && <Loader2 size={14} className="animate-spin" />}
               End Interview
             </button>
          </div>
       </div>

       {/* ─── Voice Interface ────────────────────────────────────── */}
       <VoiceInterface 
         interview={interview}
         currentQuestionIndex={currentQuestionIndex}
         phase={phase}
         isFinishing={isFinishing}
         transcript={transcript}
         aiResponseText={aiResponseText}
         onStartSpeaking={handleStartSpeaking}
         onStopSpeaking={handleStopSpeaking}
       />

       {/* ─── Question Progress Bar ──────────────────────────────── */}
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
         {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i === currentQuestionIndex 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-lg shadow-indigo-500/30' 
                  : i < currentQuestionIndex 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < currentQuestionIndex ? '✓' : i + 1}
            </div>
         ))}
       </div>
    </div>
  );
}
