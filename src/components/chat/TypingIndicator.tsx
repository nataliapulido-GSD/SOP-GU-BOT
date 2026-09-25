"use client";

export const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-1 p-4 max-w-[100px] bg-white border border-zinc-100 rounded-2xl rounded-bl-none shadow-sm">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
    );
};