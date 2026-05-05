'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Plus, Bot, ChevronRight, History } from 'lucide-react';
import { fetchWithAuth } from '@/services/api';

export default function GovBotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; time: string }[]>([
    { role: 'bot', text: "Namaste! I am **GovBot**, your personal government schemes assistant. How can I help you today?", time: '10:00 AM' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, time }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.', time: 'Error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100-64px)] min-h-[600px] bg-slate-50 flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[300px] bg-white border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-[#002f6c]" />
            <span className="font-black text-slate-900 text-[15px]">GovBot Chats</span>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-4 ml-2">Recent Chats</p>
          <ChatItem active={true} title="What health insurance schem..." date="24 Apr" />
          <ChatItem active={false} title="Farmer subsidy in Telangana" date="22 Apr" />
          <ChatItem active={false} title="Post-matric scholarship list" date="20 Apr" />
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-400 text-[13px] font-bold cursor-pointer hover:text-slate-900 transition-colors">
            <History size={18} />
            <span>Clear Conversation</span>
          </div>
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-grow flex flex-col relative bg-white lg:bg-slate-50">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 sm:p-12 space-y-8 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex items-start gap-4 max-w-[85%] lg:max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white' : 'bg-[#002f6c] text-white'
                }`}>
                  {m.role === 'user' ? <span className="font-bold text-xs">M</span> : <Bot size={20} />}
                </div>
                <div>
                  <div className={`p-5 rounded-2xl text-[15px] leading-relaxed font-medium shadow-sm border ${
                    m.role === 'user' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-800 border-slate-100'
                  }`}>
                    {m.text.split('**').map((part, idx) => (idx % 2 === 1 ? <b key={idx}>{part}</b> : part))}
                  </div>
                  <p className={`text-[11px] font-bold text-slate-400 mt-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl w-48 h-12"></div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-6 sm:p-12 bg-white lg:bg-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-[#002f6c]/5 blur-xl group-focus-within:bg-[#002f6c]/10 transition-all rounded-3xl"></div>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-3xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-[#002f6c]/20 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any government scheme..."
                className="flex-grow px-6 py-4 bg-transparent border-none outline-none text-[16px] font-medium placeholder:text-slate-300"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-[#002f6c] text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-slate-900 transition-all shadow-lg shadow-[#002f6c]/20"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
              GovBot may make mistakes. Always verify on official government portals.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatItem({ active, title, date }: { active: boolean; title: string; date: string }) {
  return (
    <div className={`p-4 rounded-xl cursor-pointer transition-all border ${
      active ? 'bg-[#002f6c]/5 border-[#002f6c]/10' : 'hover:bg-slate-50 border-transparent'
    }`}>
      <div className="flex items-center gap-3 mb-1">
        <MessageSquare size={14} className={active ? 'text-[#002f6c]' : 'text-slate-300'} />
        <span className={`text-[13px] font-bold line-clamp-1 ${active ? 'text-slate-900' : 'text-slate-500'}`}>{title}</span>
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-7">{date}</span>
    </div>
  );
}
