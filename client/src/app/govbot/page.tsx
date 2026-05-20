'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Plus, Bot, ChevronRight, History, ExternalLink, ArrowRight, Sparkles, Zap, BookOpen, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SchemeCard {
  id: string;
  name: string;
  category: string;
  type: string;
  state: string;
  benefit: string;
  apply_link: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  time: string;
  schemes?: SchemeCard[];
  type?: string;
}

const SUGGESTION_CHIPS = [
  { icon: '🌾', label: 'Farmer Schemes' },
  { icon: '🎓', label: 'Student Scholarships' },
  { icon: '🏥', label: 'Health Insurance' },
  { icon: '👩', label: 'Women Schemes' },
  { icon: '💼', label: 'Business Loans' },
  { icon: '🏠', label: 'Housing Schemes' },
  { icon: '📋', label: 'How to Apply' },
  { icon: '📊', label: 'All Schemes' },
];

// Render markdown-like text with bold, links, and emoji
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, li) => {
        // Check if line is a numbered list item
        const isNumbered = /^\d+[.️⃣]/.test(line.trim());
        // Check for bullet point
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        // Check for emoji list
        const isEmojiList = /^[📋📄📝📊🏛️📂💰🔗🌐📍💡⚥🎂✅🚫🟢🟡🔴🔍]/.test(line.trim());

        const className = (isNumbered || isBullet || isEmojiList) ? 'pl-1' : '';

        // Render bold text
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pi} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          // Render links
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const urlParts = part.split(urlRegex);
          return urlParts.map((urlPart, ui) => {
            if (urlRegex.test(urlPart)) {
              return (
                <a key={`${pi}-${ui}`} href={urlPart} target="_blank" rel="noopener noreferrer"
                  className="text-[#002f6c] underline underline-offset-2 hover:text-orange-600 transition-colors">
                  {urlPart.replace('https://', '').replace('http://', '').split('/')[0]} ↗
                </a>
              );
            }
            return <span key={`${pi}-${ui}`}>{urlPart}</span>;
          });
        });

        if (line.trim() === '') return <div key={li} className="h-2"></div>;

        return (
          <p key={li} className={`${className} text-[14.5px] leading-relaxed`}>
            {rendered}
          </p>
        );
      })}
    </div>
  );
}

function SchemeCardFull({ scheme }: { scheme: SchemeCard }) {
  const categoryColors: Record<string, string> = {
    farmer: 'bg-green-50 text-green-700 border-green-200',
    student: 'bg-blue-50 text-blue-700 border-blue-200',
    women: 'bg-pink-50 text-pink-700 border-pink-200',
    business: 'bg-purple-50 text-purple-700 border-purple-200',
    healthcare: 'bg-red-50 text-red-700 border-red-200',
    housing: 'bg-amber-50 text-amber-700 border-amber-200',
    employment: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    insurance: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  const colorClass = categoryColors[scheme.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <Link
      href={`/schemes/${scheme.id}`}
      className="block p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#002f6c]/20 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-grow">
          <p className="text-[15px] font-bold text-slate-800 group-hover:text-[#002f6c] transition-colors">{scheme.name}</p>
          <p className="text-[12.5px] text-slate-400 mt-1.5 line-clamp-2 font-medium">{scheme.benefit}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${colorClass}`}>
              {scheme.category}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-100">
              {scheme.type === 'central' ? '🏛️ Central' : `📍 ${scheme.state}`}
            </span>
          </div>
        </div>
        <ArrowRight size={16} className="text-slate-200 group-hover:text-[#002f6c] shrink-0 mt-1 transition-colors" />
      </div>
    </Link>
  );
}

export default function GovBotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: "Namaste! 🙏 I'm **GovBot**, your personal government schemes assistant. I can help you:\n\n• Find schemes you're eligible for\n• Explain benefits & documents needed\n• Guide you through the application process\n• Answer questions about deadlines\n\nWhat would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ title: string; date: string; }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, time }]);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.message,
        time: botTime,
        schemes: data.schemes,
        type: data.type
      }]);

      // Add to chat history
      if (chatHistory.length === 0 || chatHistory[0].title !== text.substring(0, 30)) {
        setChatHistory(prev => [
          { title: text.substring(0, 30) + (text.length > 30 ? '...' : ''), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
          ...prev.slice(0, 9)
        ]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, I\'m having trouble connecting right now. Please check if the server is running.',
        time: 'Error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      text: "Chat cleared! 🔄 How can I help you with government schemes today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info'
    }]);
  };

  const showWelcome = messages.length <= 1;

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-64px)] min-h-[600px] bg-slate-50 flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[300px] bg-white border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#002f6c] rounded-xl flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-slate-900 text-[15px]">GovBot Chats</span>
          </div>
          <button onClick={clearChat} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors" title="New Chat">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2 no-scrollbar">
          {chatHistory.length > 0 ? (
            <>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-4 ml-2">Recent Chats</p>
              {chatHistory.map((chat, i) => (
                <ChatItem key={i} active={i === 0} title={chat.title} date={chat.date} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-slate-300" />
              </div>
              <p className="text-[13px] font-bold text-slate-400 mb-2">No chat history yet</p>
              <p className="text-[11px] text-slate-300 font-medium">Start a conversation to see your chat history here.</p>
            </div>
          )}
        </div>

        {/* Sidebar Quick Links */}
        <div className="p-4 space-y-2 border-t border-slate-100">
          <Link href="/schemes" className="flex items-center gap-3 text-slate-400 text-[12px] font-bold p-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all">
            <BookOpen size={16} />
            <span>Browse All Schemes</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 text-[12px] font-bold p-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Zap size={16} />
            <span>My Recommendations</span>
          </Link>
          <button onClick={clearChat} className="flex items-center gap-3 text-slate-400 text-[12px] font-bold p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all w-full">
            <History size={16} />
            <span>Clear Conversation</span>
          </button>
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-grow flex flex-col relative bg-white lg:bg-slate-50">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 sm:p-10 space-y-6 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex items-start gap-4 max-w-[85%] lg:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-[#002f6c] text-white' : 'bg-[#002f6c] text-white'
                }`}>
                  {m.role === 'user' ? <span className="font-bold text-xs">U</span> : <Bot size={20} />}
                </div>

                {/* Content */}
                <div className="space-y-3 min-w-0">
                  <div className={`p-5 rounded-2xl text-[14.5px] leading-relaxed font-medium shadow-sm border ${
                    m.role === 'user'
                      ? 'bg-[#002f6c] text-white border-[#002f6c] rounded-tr-lg'
                      : 'bg-white text-slate-700 border-slate-100 rounded-tl-lg'
                  }`}>
                    {m.role === 'user' ? m.text : <RenderMarkdown text={m.text} />}
                  </div>

                  {/* Scheme Cards */}
                  {m.schemes && m.schemes.length > 0 && (
                    <div className="space-y-2">
                      {m.schemes.slice(0, 6).map((scheme) => (
                        <SchemeCardFull key={scheme.id} scheme={scheme} />
                      ))}
                      {m.schemes.length > 6 && (
                        <Link href="/schemes" className="block text-center text-[12px] font-black text-[#002f6c] hover:underline py-2 uppercase tracking-widest">
                          View all {m.schemes.length} schemes →
                        </Link>
                      )}
                    </div>
                  )}

                  <p suppressHydrationWarning className={`text-[11px] font-bold text-slate-300 ${m.role === 'user' ? 'text-right' : ''}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Welcome Suggestions */}
          {showWelcome && (
            <div className="max-w-2xl mx-auto">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-4 text-center">Try asking about</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(chip.label)}
                    className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 hover:border-[#002f6c]/20 hover:bg-[#002f6c]/5 transition-all text-left group"
                  >
                    <span className="text-lg">{chip.icon}</span>
                    <span className="text-[12px] font-bold text-slate-500 group-hover:text-[#002f6c] transition-colors">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#002f6c] flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl rounded-tl-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[11px] text-slate-300 font-bold ml-2">GovBot is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 sm:p-8 bg-white lg:bg-transparent border-t border-slate-100 lg:border-0">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-[#002f6c]/5 blur-xl group-focus-within:bg-[#002f6c]/10 transition-all rounded-3xl"></div>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-[#002f6c]/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any government scheme, eligibility, or documents..."
                className="flex-grow px-5 py-3.5 bg-transparent border-none outline-none text-[15px] font-medium placeholder:text-slate-300"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-[#002f6c] text-white p-3.5 rounded-xl disabled:opacity-40 hover:bg-slate-900 transition-all shadow-lg shadow-[#002f6c]/20"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-300 mt-3 font-bold uppercase tracking-widest">
              GovBot provides guidance only. Always verify on official government portals.
            </p>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
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
