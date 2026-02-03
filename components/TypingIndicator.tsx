import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
         {/* Bot Icon */}
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </div>
      <div>
        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
          <div className="flex space-x-1 h-5 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
        <span className="text-xs text-gray-400 ml-1">Typing...</span>
      </div>
    </div>
  );
};