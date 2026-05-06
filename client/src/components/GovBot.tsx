'use client';

import { useState, useRef, useEffect } from 'react';
import { fetchWithAuth } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SchemeCard {
  id: string;
  name: string;
  category: string;
  type: string;
  state: string;
  benefit: string;
  apply_link: string;
}

interface BotMessage {
  role: 'user' | 'bot';
  text: string;
  schemes?: SchemeCard[];
  type?: string;
}

const QUICK_REPLIES = [
  'Farmer schemes',
  'Student scholarships',
  'Health insurance',
  'Schemes in my state',
  'How to apply?',
];

// Render markdown-like bold text
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    // Handle newlines
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </span>
    ));
  });
}

function SchemeCardWidget({ scheme }: { scheme: SchemeCard }) {
  return (
    <Link
      href={`/schemes/${scheme.id}`}
      className="block p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#002f6c]/20 hover:bg-[#002f6c]/5 transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-slate-800 group-hover:text-[#002f6c] truncate">{scheme.name}</p>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{scheme.benefit}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] font-black uppercase tracking-wider bg-[#002f6c]/10 text-[#002f6c] px-2 py-0.5 rounded-full">{scheme.category}</span>
            <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{scheme.type}</span>
          </div>
        </div>
        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#002f6c] shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default function GovBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<BotMessage[]>([
    { role: 'bot', text: "Namaste! 🙏 I'm **GovBot**, your government schemes assistant. Ask me anything about schemes, eligibility, or documents!", type: 'info' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setInput('');
    setShowQuickReplies(false);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.message,
        schemes: data.schemes,
        type: data.type
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-[370px] sm:w-[420px] h-[550px] mb-4 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#002f6c] p-4 px-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <span className="font-black text-sm">GovBot</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-slate-300 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/govbot" className="hover:bg-white/10 p-2 rounded-lg transition-colors" title="Open full chat">
                  <ExternalLink size={16} />
                </Link>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 no-scrollbar">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] space-y-2`}>
                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed font-medium ${
                      m.role === 'user'
                        ? 'bg-[#002f6c] text-white rounded-br-lg'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-lg shadow-sm'
                    }`}>
                      {renderMarkdown(m.text)}
                    </div>
                    {/* Scheme Cards */}
                    {m.schemes && m.schemes.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {m.schemes.slice(0, 4).map((scheme) => (
                          <SchemeCardWidget key={scheme.id} scheme={scheme} />
                        ))}
                        {m.schemes.length > 4 && (
                          <Link href="/schemes" className="block text-center text-[11px] font-bold text-[#002f6c] hover:underline py-1">
                            View all {m.schemes.length} schemes →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick Replies */}
              {showQuickReplies && messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => sendMessage(qr)}
                      className="text-[11px] font-bold text-[#002f6c] bg-[#002f6c]/5 border border-[#002f6c]/10 px-3 py-1.5 rounded-full hover:bg-[#002f6c]/10 transition-colors"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-lg p-3.5 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about any scheme..."
                  className="flex-grow bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none focus:ring-2 focus:ring-[#002f6c]/15 focus:border-[#002f6c]/20 transition-all placeholder:text-slate-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-[#002f6c] text-white p-2.5 rounded-xl disabled:opacity-40 hover:bg-slate-800 transition-all shadow-md shadow-[#002f6c]/15"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#002f6c] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#002f6c]/30 relative"
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
}
