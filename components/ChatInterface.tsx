'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from './MessageBubble';
import type { Message, ChatResponse } from '@/types';

const QUICK_QUESTIONS = [
  '두통이 심하고 열이 나요',
  '오른쪽 아랫배가 아파요',
  '목이 아프고 기침이 나요',
  '가슴이 답답하고 숨이 가빠요',
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    '안녕하세요! 저는 좋은삼선병원 AI 환자 상담 도우미입니다. 😊\n\n증상이나 궁금한 점을 자유롭게 말씀해 주세요. 증상을 분석하고 적절한 진료과를 안내해 드리겠습니다.\n\n⚠️ 본 상담은 참고용이며 전문 의료 진단을 대체하지 않습니다.',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return uuidv4();
    return localStorage.getItem('medbot_session') ?? (() => {
      const id = uuidv4();
      localStorage.setItem('medbot_session', id);
      return id;
    })();
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, session_id: sessionId, history }),
      });

      const data: ChatResponse & { error?: string } = await res.json();

      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.error ?? data.message,
        classification: data.error ? undefined : data.classification,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [messages, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f7fb]">
      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-gradient-to-r from-[#0a1e4e] via-[#0f2561] to-[#1a4a8a] shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          {/* Top bar: logo + title */}
          <div className="flex items-center gap-3 pt-3 pb-2">
            {/* Logo mark */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f2561] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-white font-bold text-base leading-tight tracking-tight">
                  좋은삼선병원
                </h1>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/15 text-white/80 border border-white/20">
                  AI 상담봇
                </span>
              </div>
              <p className="text-white/50 text-[11px] mt-0.5">Samsun Good Hospital · 24시간 운영</p>
            </div>

            <a
              href="tel:051-240-2000"
              className="ml-auto flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden sm:inline">051-240-2000</span>
            </a>
          </div>

          <div className="pb-1" />
        </div>
      </header>

      {/* ── Content ── */}
      <>
        {/* Messages area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

              {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="mr-2 flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#0f2561] to-[#1d6fa4] flex items-center justify-center text-white shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 rounded-full bg-[#1d6fa4] animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-[#1d6fa4] animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-[#1d6fa4] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
              )}

            <div ref={bottomRef} />
          </div>
        </main>

        {/* Quick questions */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-gray-500 mb-2 font-medium">빠른 질문 예시</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#1d6fa4]/30 text-[#0f2561] bg-[#1d6fa4]/5 hover:bg-[#1d6fa4]/15 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
          <div className="max-w-3xl mx-auto flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="증상이나 문의 사항을 입력하세요... (Enter로 전송)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d6fa4]/40 focus:border-[#1d6fa4] transition max-h-32 overflow-y-auto bg-white"
              style={{ height: 'auto', minHeight: '44px' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f2561] to-[#1d6fa4] text-white flex items-center justify-center hover:from-[#1a3a7a] hover:to-[#2279be] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-2">
            본 AI 상담은 참고용입니다. 정확한 진단은 반드시 의사와 상담하세요.
          </p>
        </div>
      </>
    </div>
  );
}
