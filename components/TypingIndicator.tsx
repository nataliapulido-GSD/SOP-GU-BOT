import React from 'react';


export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex mt-2 space-x-2.5 max-w-xs">
      <img src="https://i.imgur.com/vReG3a4.jpeg" className="w-8 h-8 rounded-full object-cover object-center flex-shrink-0 mt-auto mb-1" />
      <div>
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex space-x-1.5 h-4 items-center">
            <div className="w-2 h-2 bg-[#5B21B6] rounded-full animate-bounce [animation-delay:-0.3s] opacity-50" />
            <div className="w-2 h-2 bg-[#5B21B6] rounded-full animate-bounce [animation-delay:-0.15s] opacity-75" />
            <div className="w-2 h-2 bg-[#5B21B6] rounded-full animate-bounce" />
          </div>
        </div>
        <span className="text-[10px] text-gray-400 ml-1 mt-0.5 block">Max is typing…</span>
      </div>
    </div>
  );
};
