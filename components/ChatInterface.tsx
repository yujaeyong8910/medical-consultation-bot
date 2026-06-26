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
  content: '안녕하세요! 저는 좋은삼선병원 AI 환자 상담 도우미입니다. 😊\n\n증상이나 궁금한 점을 자유롭게 말씀해 주세요. 증상을 분석하고 적절한 진료과를 안내해 드리겠습니다.\n\n⚠️ 본 상담은 참고용이며 전문 의료 진단을 대체하지 않습니다.',
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

      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: data.error ?? data.message,
        classification: data.error ? undefined : data.classification,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        timestamp: new Date(),
      }]);
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <header style={{
        flexShrink: 0,
        background: 'linear-gradient(135deg, #0d2044 0%, #1e3a5f 50%, #2d6a9f 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        padding: '0',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0, position: 'relative'
          }}>
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#34d399', border: '2px solid #1e3a5f'
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px', margin: 0, lineHeight: 1.3 }}>
                좋은삼선병원
              </h1>
              <span style={{
                fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>AI 상담봇</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: '2px 0 0 0' }}>
              Samsun Good Hospital · 24시간 운영
            </p>
          </div>

          <a href="tel:051-240-2000" style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            color: 'rgba(255,255,255,0.75)', fontSize: '12px', textDecoration: 'none',
            background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>051-240-2000</span>
          </a>
        </div>
      </header>

      {/* Messages */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '20px 16px' }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '20px 20px 20px 4px', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 150, 300].map((delay, i) => (
                    <span key={i} style={{
                      width: '8px', height: '8px', borderRadius: '50%', background: '#2d6a9f',
                      display: 'inline-block', animation: `bounce 1s ${delay}ms infinite`
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ flexShrink: 0, background: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '12px 16px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>빠른 질문 예시</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    fontSize: '12px', padding: '6px 14px', borderRadius: '20px',
                    border: '1px solid #bfdbfe', color: '#1e3a5f',
                    background: '#eff6ff', cursor: 'pointer', fontWeight: 500
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        flexShrink: 0, background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 16px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="증상이나 문의 사항을 입력하세요... (Enter로 전송)"
            rows={1}
            disabled={isLoading}
            style={{
              flex: 1, resize: 'none', borderRadius: '12px',
              border: '1.5px solid #d1d5db', padding: '10px 14px',
              fontSize: '14px', color: '#111827', background: '#f9fafb',
              outline: 'none', maxHeight: '128px', overflowY: 'auto',
              fontFamily: 'inherit', lineHeight: '1.5',
              minHeight: '44px',
            }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#2d6a9f'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)'
                : '#e5e7eb',
              border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: input.trim() && !isLoading ? '0 2px 8px rgba(30,58,95,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <svg width="20" height="20" fill="none" stroke={input.trim() && !isLoading ? '#ffffff' : '#9ca3af'} viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
          본 AI 상담은 참고용입니다. 정확한 진단은 반드시 의사와 상담하세요.
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
