'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { subjects } from '@/lib/subjects';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface QuickOption {
  id: string;
  label: string;
  action: () => void;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "I'm here to help. You can ask about subjects, levels (OL/AS/AL), booking, or pricing.",
  hello: 'Welcome to El7a2ny Tutoring 👋 Need help with anything or want to book a subject now?',
  pricing: 'Our sessions start from $30/hour. Bundle packages are available for better value. Visit the Booking page to see options!',
  booking: 'You can book by subject with OL/AS/AL level in under 2 minutes. I can prefill it for you now.',
  subjects: 'We cover: Maths, Physics, Chemistry, Biology, Human Biology, IT, CS, Accounting, Business, Economics, Combined Science, Arabic, and National Arabic (Year 12 Only).',
  help: 'I can tell you about our subjects, pricing, booking process, or tutors. What would you like to know?',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) return BOT_RESPONSES.pricing;
  if (lower.includes('book') || lower.includes('session') || lower.includes('schedule')) return BOT_RESPONSES.booking;
  if (lower.includes('subject') || lower.includes('course')) return BOT_RESPONSES.subjects;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return BOT_RESPONSES.hello;
  if (lower.includes('help')) return BOT_RESPONSES.help;
  return BOT_RESPONSES.default;
}

export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>([]);
  const [bookingSubject, setBookingSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: BOT_RESPONSES.hello },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pushBot = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text }]);
  };

  const pushUser = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }]);
  };

  const startBookingFlow = () => {
    pushBot('Great. Choose a subject and I will prefill it in booking for you.');
    setQuickOptions(
      subjects.map(subject => ({
        id: `subject-${subject.id}`,
        label: subject.name,
        action: () => {
          pushUser(subject.name);
          setBookingSubject(subject.name);
          pushBot(`Perfect. Now choose level for ${subject.name}.`);
          setQuickOptions([
            {
              id: 'level-ol',
              label: 'OL',
              action: () => completeBooking(subject.name, 'OL'),
            },
            {
              id: 'level-as',
              label: 'AS',
              action: () => completeBooking(subject.name, 'AS'),
            },
            {
              id: 'level-al',
              label: 'AL',
              action: () => completeBooking(subject.name, 'AL'),
            },
          ]);
        },
      }))
    );
  };

  const completeBooking = (subject: string, level: 'OL' | 'AS' | 'AL') => {
    pushUser(level);
    pushBot(`Done. Opening booking with ${subject} (${level}) selected first. You can add more subjects there.`);
    setQuickOptions([]);
    const url = `/booking?subject=${encodeURIComponent(subject)}&level=${level}`;
    setTimeout(() => router.push(url), 500);
  };

  const resetQuickOptions = () => {
    setQuickOptions([
      { id: 'book', label: 'Book a subject', action: startBookingFlow },
      {
        id: 'subjects',
        label: 'View subjects',
        action: () => {
          pushUser('View subjects');
          pushBot(BOT_RESPONSES.subjects);
          setQuickOptions([]);
        },
      },
      {
        id: 'pricing',
        label: 'Pricing',
        action: () => {
          pushUser('Pricing');
          pushBot(BOT_RESPONSES.pricing);
          setQuickOptions([]);
        },
      },
      {
        id: 'need-help',
        label: 'Need help',
        action: () => {
          pushUser('Need help');
          pushBot(BOT_RESPONSES.help);
          setQuickOptions([]);
        },
      },
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) resetQuickOptions();
    if (!open) {
      setQuickOptions([]);
      setBookingSubject(null);
    }
  }, [open]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    pushUser(trimmed);
    setInput('');
    // Simulate bot typing delay
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      if (lower.includes('book')) {
        pushBot(BOT_RESPONSES.booking);
        startBookingFlow();
        return;
      }
      if (bookingSubject && (lower === 'ol' || lower === 'as' || lower === 'al')) {
        completeBooking(bookingSubject, lower.toUpperCase() as 'OL' | 'AS' | 'AL');
        return;
      }
      pushBot(getBotResponse(trimmed));
    }, 600);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center shadow-[0_8px_24px_rgba(242,116,5,0.45)] hover:shadow-[0_8px_32px_rgba(242,116,5,0.60)] transition-shadow"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[420px] glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-orange to-brand-orangeSoft px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">E</div>
              <div>
                <p className="text-white font-semibold text-sm">El7a2ny Assistant</p>
                <p className="text-white/70 text-xs">Always online</p>
              </div>
              <span className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-orange text-white rounded-br-sm'
                        : 'bg-white/[0.07] text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {quickOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {quickOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={option.action}
                      className="px-3 py-1.5 rounded-full text-xs bg-white/[0.07] border border-white/[0.10] text-[#D9E4F5] hover:border-brand-orange/50 hover:text-white transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type a message…"
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-[#6B829E] focus:outline-none focus:border-brand-orange/50"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send message"
                className="w-9 h-9 rounded-xl bg-brand-orange hover:bg-brand-orangeSoft flex items-center justify-center transition-colors disabled:opacity-40"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
