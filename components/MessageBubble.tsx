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
        <div className="mr-2 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          M
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && (
          <span className="text-xs text-gray-500 mb-1 ml-1">메디봇</span>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && message.classification && (
          <div className="w-full mt-1">
            <ClassificationCard classification={message.classification} />
          </div>
        )}

        <span className={`text-xs text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
          나
        </div>
      )}
    </div>
  );
}
