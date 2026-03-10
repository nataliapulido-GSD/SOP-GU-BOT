import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <div className={`flex w-full mt-2 space-x-2.5 max-w-[88%] md:max-w-[78%] ${isUser ? 'ml-auto justify-end' : ''}`}>

      {/* Bot avatar */}
      {!isUser && (
        <img src="https://i.imgur.com/QXUMHai.png" className="w-8 h-8 rounded-full object-cover object-center flex-shrink-0 mt-auto mb-1" />
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-3 text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap ${
            isUser
              ? 'bg-[#5B21B6] text-white rounded-2xl rounded-br-none shadow-sm'
              : message.isError
                ? 'bg-red-50 text-red-600 border border-red-200 rounded-2xl rounded-bl-none shadow-sm'
                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none shadow-sm'
          }`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#5B21B6] flex items-center justify-center mt-auto mb-1">
          <UserIcon />
        </div>
      )}
    </div>
  );
};
