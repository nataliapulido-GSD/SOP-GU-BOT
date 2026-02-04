import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  // Icon for Bot
  const BotIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </svg>
  );

  // Icon for User
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <div className={`flex w-full mt-2 space-x-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'ml-auto justify-end' : ''}`}>
      
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mt-auto mb-1">
          <BotIcon />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-3 shadow-sm text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap ${
            isUser
              ? 'bg-[#667eea] text-white rounded-2xl rounded-br-none'
              : `bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none ${message.isError ? 'border border-red-200 bg-red-50 text-red-600' : ''}`
          }`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#5a6fd6] flex items-center justify-center mt-auto mb-1">
          <UserIcon />
        </div>
      )}
    </div>
  );
};
