'use client';

import { useState, useRef, useEffect } from 'react';
import { fetchWithAuth } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function GovBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5000/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setMessages([
            { role: 'bot', text: `Hi ${data.name?.split(' ')[0] || 'Citizen'}, I'm GovBot. How can I help you with your matched schemes today?` }
          ]);
        }
      } catch (err) {
        console.error('Error fetching profile for GovBot:', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-[350px] sm:w-[400px] h-[500px] mb-4 rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot size={20} />
                <span className="font-bold">GovBot</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    m.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-800'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-400">GovBot is typing...</div>}
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-grow bg-slate-100 border-none px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-primary text-white p-2 rounded-lg disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
