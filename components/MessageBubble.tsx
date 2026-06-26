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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#0f2561] to-[#1d6fa4] flex items-center justify-center text-white shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      )}

      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && (
          <span className="text-xs text-gray-500 mb-1 ml-1 font-medium">좋은삼선병원 AI</span>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-gradient-to-br from-[#0f2561] to-[#1d6fa4] text-white rounded-tr-sm shadow-md'
              : 'bg-white text-gray-900 rounded-tl-sm shadow-sm border border-gray-200'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && message.classification && (
          <div className="w-full mt-1.5">
            <ClassificationCard classification={message.classification} />
          </div>
        )}

        <span className={`text-[11px] text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0 w-9 h-9 rounded-full bg-[#e8edf7] flex items-center justify-center text-[#0f2561] text-sm font-bold">
          나
        </div>
      )}
    </div>
  );
}
