'use client';

import ClassificationCard from './ClassificationCard';
import type { Message } from '@/types';

interface Props {
  message: Message;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '16px', alignItems: 'flex-end', gap: '8px' }}>
      {!isUser && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      )}

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && (
          <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', marginLeft: '4px', fontWeight: 500 }}>
            좋은삼선병원 AI
          </span>
        )}

        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)'
            : '#ffffff',
          color: isUser ? '#ffffff' : '#1a1a1a',
          boxShadow: isUser
            ? '0 2px 12px rgba(30,58,95,0.3)'
            : '0 2px 8px rgba(0,0,0,0.08)',
          border: isUser ? 'none' : '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
            {message.content}
          </p>
        </div>

        {!isUser && message.classification && (
          <div style={{ width: '100%', marginTop: '8px' }}>
            <ClassificationCard classification={message.classification} />
          </div>
        )}

        <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginLeft: isUser ? 0 : '4px', marginRight: isUser ? '4px' : 0 }}>
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#e8edf7', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          fontSize: '13px', fontWeight: 700, color: '#1e3a5f'
        }}>
          나
        </div>
      )}
    </div>
  );
}
