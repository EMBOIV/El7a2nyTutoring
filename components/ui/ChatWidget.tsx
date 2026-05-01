'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface SuggestedOption {
  id: string;
  label: string;
  intent: Intent;
}

type Intent = 'BOOK_SESSION' | 'CHOOSE_SUBJECT' | 'URGENT_HELP' | 'HOW_IT_WORKS';

const SUGGESTED_OPTIONS: SuggestedOption[] = [
  { id: 'book-session', label: 'Book a session', intent: 'BOOK_SESSION' },
  { id: 'choose-subjects', label: 'Choose my subjects', intent: 'CHOOSE_SUBJECT' },
  { id: 'urgent-help', label: 'I need help before exams', intent: 'URGENT_HELP' },
  { id: 'how-it-works', label: 'How does it work?', intent: 'HOW_IT_WORKS' },
];

const BOT_RESPONSES: Record<Intent | 'hello' | 'fallback', string> = {
  hello: 'Welcome to El7a2ny Tutoring. Tell me what you need, or tap an option below.',
  BOOK_SESSION: 'Booking takes less than a minute. I can take you to the guided booking flow now.',
  CHOOSE_SUBJECT: 'Pick your level first, then choose a subject quickly using search. I can open that step for you.',
  URGENT_HELP: 'If exams are close, start with a private session and a focused revision plan today.',
  HOW_IT_WORKS: 'Simple flow: choose level, choose subject, choose session type, then pick a time. We handle the rest.',
  fallback: 'I can help you with booking, subjects, or exam prep. Choose an option below.',
};

const INTENT_PATTERNS: Record<Intent, string[]> = {
  BOOK_SESSION: ['book', 'booking', 'schedule', 'reserve', 'lesson', 'session', 'start session', 'class'],
  CHOOSE_SUBJECT: ['subject', 'subjects', 'course', 'courses', 'study', 'available subjects', 'what can i study'],
  URGENT_HELP: ['exam soon', 'last minute', 'urgent', 'late', 'need fast help', 'quick help', 'asap'],
  HOW_IT_WORKS: ['how does it work', 'how it works', 'explain system', 'what do you do', 'process', 'steps'],
};

function normalizeInput(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function keywordMatchScore(input: string, pattern: string): number {
  if (!input || !pattern) return 0;
  if (input.includes(pattern)) return 1;

  const inputTokens = input.split(' ');
  const patternTokens = pattern.split(' ');
  let matches = 0;

  for (const p of patternTokens) {
    const matched = inputTokens.some(token => {
      if (token === p) return true;
      if (token.length >= 3 && (token.startsWith(p) || p.startsWith(token))) return true;
      return false;
    });
    if (matched) matches += 1;
  }

  return matches / patternTokens.length;
}

function detectIntent(input: string): Intent | null {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  let bestIntent: Intent | null = null;
  let bestScore = 0;

  (Object.keys(INTENT_PATTERNS) as Intent[]).forEach(intent => {
    const patterns = INTENT_PATTERNS[intent];
    const score = Math.max(...patterns.map(p => keywordMatchScore(normalized, p)));
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  });

  return bestScore >= 0.55 ? bestIntent : null;
}

export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [redirected, setRedirected] = useState(false);
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

  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_URL || 'https://wa.me/201010294098';

  const handleIntent = (intent: Intent) => {
    setFailedAttempts(0);
    pushBot(BOT_RESPONSES[intent]);

    if (intent === 'BOOK_SESSION') {
      setTimeout(() => router.push('/booking'), 500);
      return;
    }

    if (intent === 'CHOOSE_SUBJECT') {
      setTimeout(() => router.push('/booking?step=2'), 500);
      return;
    }

    if (intent === 'URGENT_HELP') {
      setTimeout(() => router.push('/booking?priority=urgent'), 500);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) {
      setFailedAttempts(0);
      setRedirected(false);
      setMessages([{ id: 0, role: 'bot', text: BOT_RESPONSES.hello }]);
    }
  }, [open]);

  const handleNoMatch = () => {
    setFailedAttempts(prev => {
      const next = prev + 1;

      if (next < 3) {
        pushBot(BOT_RESPONSES.fallback);
        return next;
      }

      setRedirected(true);
      pushBot(`Need direct help? Contact us on WhatsApp. ${whatsappLink}`);
      return next;
    });
  };

  const processMessage = (text: string) => {
    if (redirected) return;
    const intent = detectIntent(text);
    if (intent) {
      handleIntent(intent);
      return;
    }
    handleNoMatch();
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || redirected) return;
    pushUser(trimmed);
    setInput('');
    setTimeout(() => processMessage(trimmed), 350);
  };

  const onSuggestedClick = (option: SuggestedOption) => {
    if (redirected) return;
    pushUser(option.label);
    setTimeout(() => handleIntent(option.intent), 220);
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
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[420px] bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-[0_12px_40px_rgba(27,42,68,0.16)] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-orange to-brand-orangeSoft px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">E</div>
              <div>
                <p className="text-white font-semibold text-sm">El7a2ny Assistant</p>
                <p className="text-white/80 text-xs">Always online</p>
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
                        : 'bg-[#F5F7FA] text-[#334155] rounded-bl-sm border border-[#E2E8F0]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggested messages (always visible) */}
            <div className="px-3 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => onSuggestedClick(option)}
                    disabled={redirected}
                    className="px-3 py-1.5 rounded-full text-xs bg-white border border-[#E2E8F0] text-[#64748B] hover:border-brand-orange/40 hover:text-[#1B2A44] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#E2E8F0] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={redirected ? 'Chat ended. Use WhatsApp for direct help.' : 'Type a message...'}
                disabled={redirected}
                className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#1B2A44] placeholder-[#94A3B8] focus:outline-none focus:border-brand-orange/50"
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
