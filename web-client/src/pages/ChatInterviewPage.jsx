import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import { getInterviewById, answerQuestion, finishInterview } from '../services/interviewService';
import { InterviewSidebar } from '../features/interview/components/InterviewSidebar';
import { ChatInterface } from '../features/interview/components/ChatInterface';

import Skeleton from '../components/loaders/Skeleton';

export default function ChatInterviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const interviewId = searchParams.get('id');

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (interviewId) {
      getInterviewById(interviewId).then(session => {
        setInterview(session);
        // Map backend 'content' to frontend 'text'
        setMessages(session.messages.map(m => ({ role: m.role, text: m.content })));
        
        // Count how many questions AI has asked to know current question index
        const aiQuestionsCount = session.messages.filter(m => m.role === 'ai').length;
        setCurrentQuestionIndex(Math.max(0, aiQuestionsCount - 1));
      }).catch(err => {
        console.error("Failed to fetch interview:", err);
      });
    }
  }, [interviewId]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAnswers(prev => [...prev, userText]);
    setIsTyping(true);

    try {
      const result = await answerQuestion(interviewId, userText);
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev, 
        { role: 'ai', text: result.nextQuestion }
      ]);
      setCurrentQuestionIndex(prev => prev + 1);
    } catch (err) {
      setIsTyping(false);
      console.error(err);
      alert('Failed to send answer. Please try again.');
    }
  };

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

  if (!interview) return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
      <div className="w-1/3 flex flex-col gap-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="flex-1 w-full rounded-2xl" />
      </div>
      <Skeleton className="flex-1 rounded-2xl" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <InterviewSidebar 
        interview={interview}
        timer={timer}
        currentQuestionIndex={currentQuestionIndex}
        isFinishing={isFinishing}
        handleEndInterview={handleEndInterview}
      />

      <ChatInterface 
        messages={messages}
        isTyping={isTyping}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        isFinishing={isFinishing}
        chatEndRef={chatEndRef}
      />
    </div>
  );
}
