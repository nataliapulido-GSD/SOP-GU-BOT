import React, { useState, useRef, useEffect } from 'react';
import { Message, WebhookPayload } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { sendMessageToWebhook } from '../services/api';
import { useConfig } from './ConfigContext';

export const ChatInterface: React.FC = () => {
  const { config } = useConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Persistent session ID for the duration of the page load
  const sessionId = useRef(`session_${Date.now()}`).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    // Only add welcome message if list is empty
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: config.welcomeMessage,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [config.welcomeMessage]); // Re-run if welcome message changes in config

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const payload: WebhookPayload = {
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: userMessageText,
      };

      const responseText = await sendMessageToWebhook(config.webhookUrl, payload);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error connecting to the server. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Send Icon SVG
  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );

  return (
    <>
      {/* Chat Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        
        {/* Background Watermark */}
        {config.logoUrl && (
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${config.logoUrl})`,
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '50%',
              opacity: 0.1, // Increased slightly to show color
              filter: 'blur(0.5px) sepia(1) hue-rotate(100deg) saturate(200%)' // Less blur, light green tint
            }}
          />
        )}

        {/* Scrollable Content */}
        <div className="absolute inset-0 z-10 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white border-t border-gray-100 relative z-20">
        <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-300 rounded-3xl p-2 px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#667eea]/30 focus-within:border-[#667eea] transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none outline-none resize-none py-3 max-h-32 text-gray-700 placeholder-gray-400 leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-full mb-1.5 transition-all duration-200 ${
              !inputText.trim() || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white shadow-md transform hover:scale-105 active:scale-95'
            }`}
          >
            <SendIcon />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">
                Press Enter to send. Shift + Enter for new line.
            </p>
        </div>
      </div>
    </>
  );
};