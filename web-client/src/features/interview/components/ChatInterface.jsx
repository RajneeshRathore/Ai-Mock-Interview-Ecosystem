import { Send } from 'lucide-react';

export function ChatInterface({ messages, isTyping, inputValue, setInputValue, handleSend, isFinishing, chatEndRef }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
       <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-1 ${msg.role === 'ai' ? 'bg-primary-600' : 'bg-slate-800'}`}>
                 {msg.role === 'ai' ? 'AI' : 'You'}
               </div>
               <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`text-xs text-slate-500 mb-1 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                    {msg.role === 'ai' ? 'AI Interviewer' : 'Your Answer'}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-lg ${msg.role === 'ai' ? 'bg-slate-100 text-slate-800 rounded-tl-none' : 'bg-primary-600 text-white rounded-tr-none'}`}>
                    {msg.text}
                  </div>
               </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center text-white mt-1">
                 AI
               </div>
               <div>
                  <div className="text-xs text-slate-500 mb-1 ml-1">AI Interviewer</div>
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-800 text-sm flex gap-1 items-center h-10">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
       </div>

       {/* Input Area */}
       <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="relative">
             <input 
               type="text" 
               value={inputValue}
               onChange={e => setInputValue(e.target.value)}
               disabled={isTyping || isFinishing}
               placeholder={isTyping ? "AI is typing..." : "Type your answer..."}
               className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors shadow-sm disabled:bg-slate-100"
             />
             <button 
               type="submit"
               disabled={!inputValue.trim() || isTyping || isFinishing}
               className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors shadow-sm disabled:bg-primary-300"
             >
               <Send size={18} />
             </button>
          </div>
       </form>
    </div>
  );
}
