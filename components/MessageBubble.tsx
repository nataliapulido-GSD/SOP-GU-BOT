import React, { useState, useRef } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  previousQuestion?: string;
}

const FEEDBACK_OPTIONS = [
  'Mixed roles or wrong SOP',
  'Answer not found but should exist',
  'Incomplete answer',
];

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, previousQuestion = '' }) => {
  const isUser = message.sender === 'user';
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showConfirmation = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowDropdown(false);
    setConfirmation(msg);
    timerRef.current = setTimeout(() => setConfirmation(null), 3000);
  };

  const handleThumbsUp = () => {
    showConfirmation('Thanks! ✓');
  };

  const handleThumbsDown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleOption = async (option: string) => {
    setShowDropdown(false);
    try {
      await fetch('https://nataliagarciapulido.app.n8n.cloud/webhook/max-feedback', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          session_id: sessionStorage.getItem('sessionId') || 'unknown',
          question: previousQuestion,
          response: message.text,
          error_type: option,
        }),
      });
    } catch {
      // silently ignore network errors
    }
    showConfirmation('Thanks for the feedback ✓');
  };

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
        <img src="https://i.imgur.com/vReG3a4.jpeg" className="w-8 h-8 rounded-full object-cover object-center flex-shrink-0 mt-auto mb-1" />
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

        {/* Feedback row — bot messages only */}
        {!isUser && (
          <div className="relative flex items-center gap-1 mt-0.5 px-1">
            {confirmation ? (
              <span className="text-[10px] text-green-500">{confirmation}</span>
            ) : (
              <>
                <button
                  onClick={handleThumbsUp}
                  className="text-gray-400 hover:text-[#5B21B6] transition-colors text-xs leading-none p-0.5"
                  aria-label="Thumbs up"
                >
                  👍
                </button>
                <button
                  onClick={handleThumbsDown}
                  className="text-gray-400 hover:text-[#5B21B6] transition-colors text-xs leading-none p-0.5"
                  aria-label="Thumbs down"
                >
                  👎
                </button>
              </>
            )}

            {/* Thumbs-down dropdown */}
            {showDropdown && (
              <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-md py-1 min-w-[210px]">
                {FEEDBACK_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => handleOption(option)}
                    className="block w-full text-left text-xs px-3 py-2 text-gray-600 hover:bg-purple-50 hover:text-[#5B21B6] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
