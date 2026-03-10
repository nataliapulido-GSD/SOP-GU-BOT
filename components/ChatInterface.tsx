import React, { useState, useRef, useEffect } from 'react';
import { Message, WebhookPayload } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { sendMessageToWebhook } from '../services/api';
import { useConfig } from './ConfigContext';

const MAX_IMAGE_URL = 'https://i.imgur.com/rMB8IOh.png';

const SUGGESTED_PROMPTS = [
  'How do I process a referral?',
  'What is the voicemail callback procedure?',
  'How do I schedule a new patient?',
  'What are the lab result notification steps?',
  'Explain the prior authorization process',
  'What is the after-hours protocol?',
];

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  externalPrompt: string | null;
  onExternalPromptHandled: () => void;
  onConversationSaved: (title: string, messages: Message[]) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  externalPrompt,
  onExternalPromptHandled,
  onConversationSaved,
}) => {
  const { config } = useConfig();

  // Persistent session ID for the duration of the page load
  const sessionId = useRef(`session_${Date.now()}`).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom on new messages or loading state change
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

  const hasUserMessages = messages.some(m => m.sender === 'user');

  const handleSend = async (text?: string) => {
    const messageText = (text ?? inputText).trim();
    if (!messageText || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const payload: WebhookPayload = {
        action: 'sendMessage',
        sessionId: sessionId,
        chatInput: messageText,
      };

      const responseText = await sendMessageToWebhook(config.webhookUrl, payload);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Derive title from the first user message in this conversation
      const allMessages = [...messages, newUserMessage, botMessage];
      const firstUserMsg = allMessages.find(m => m.sender === 'user');
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 60) : 'Conversation';
      onConversationSaved(title, allMessages);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, there was an error connecting to the server. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prompts injected externally (e.g., clinic buttons in Sidebar)
  useEffect(() => {
    if (externalPrompt !== null) {
      handleSend(externalPrompt);
      onExternalPromptHandled();
    }
  }, [externalPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );

  return (
    <>
      {/* Chat Area */}
      <div className="flex-1 relative overflow-hidden bg-[#f8f7ff]">
        <div className="absolute inset-0 overflow-y-auto scroll-smooth">

          {!hasUserMessages ? (
            /* ── Empty state: Max hero + welcome message + suggested prompts ── */
            <div className="flex flex-col items-center px-4 pt-6 pb-6 space-y-5">

              {/* Max hero card */}
              <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-purple-100">
                <img
                  src={MAX_IMAGE_URL}
                  alt="Max"
                  className="w-full h-52 object-cover object-top"
                />
              </div>
              <div className="w-full max-w-md px-1">
                <p className="text-gray-900 text-2xl font-bold leading-tight tracking-tight">Hi, I'm Max.</p>
                <p className="text-purple-600 text-sm mt-0.5 font-medium">Your GSD SOP Assistant</p>
              </div>

              {/* Welcome message bubble */}
              <div className="w-full max-w-md">
                {messages
                  .filter(m => m.id === 'welcome')
                  .map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
              </div>

              {/* Suggested prompts */}
              <div className="w-full max-w-md">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-3">
                  Suggested questions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-purple-200 bg-white text-[#5B21B6] hover:bg-purple-50 hover:border-[#5B21B6] hover:shadow-sm transition-all font-medium leading-snug"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ── Active chat: full message list ── */
            <div className="p-4 md:p-6 space-y-2">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          )}

          {isLoading && (
            <div className="px-4 md:px-6 pb-2">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-3xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#5B21B6]/25 focus-within:border-[#5B21B6] transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about an SOP…"
            className="w-full bg-transparent border-none outline-none resize-none py-3 max-h-32 text-gray-700 placeholder-gray-400 leading-relaxed text-sm"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-full mb-1.5 transition-all duration-200 flex-shrink-0 ${
              !inputText.trim() || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#5B21B6] hover:bg-[#4c1d95] text-white shadow-md transform hover:scale-105 active:scale-95'
            }`}
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Press Enter to send · Shift + Enter for new line
        </p>
      </div>
    </>
  );
};
