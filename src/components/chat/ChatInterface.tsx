"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Button } from "@/components/ui/button";
import { SendHorizontal, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MAX_IMAGE_URL = 'https://i.imgur.com/vReG3a4.jpeg';

const SUGGESTED_PROMPTS = [
    { label: 'New Patient Setup', query: 'What is the process for scheduling a new patient?' },
    { label: 'Deceased Patient Script', query: 'What is the approved script for a deceased patient call?' },
    { label: 'Transfer Requirements', query: 'What are the requirements for Transfer of Care?' },
    { label: 'IT Help Desk', query: 'What is the Help Desk phone number?' },
];

interface ChatInterfaceProps {
    apiUrl: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiUrl }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const sessionId = useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : 'session-id').current;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, streamingText]);

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
            const responsePromise = fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatInput: messageText,
                    sessionId: sessionId,
                }),
            }).then(res => res.json());

            setIsStreaming(true);
            setStreamingText('');
            const thinkingText = 'Searching SOPs';
            let dots = '';
            const thinkingInterval = setInterval(() => {
                dots = dots.length >= 3 ? '' : dots + '.';
                setStreamingText(thinkingText + dots);
            }, 300);

            const data = await responsePromise;
            clearInterval(thinkingInterval);

            const fullResponse = data.output || data.response || data.message || '';
            const words = fullResponse.split(' ');
            let accumulated = '';

            for (let i = 0; i < words.length; i++) {
                accumulated += (i > 0 ? ' ' : '') + words[i];
                setStreamingText(accumulated);
                await new Promise(resolve => setTimeout(resolve, 30));
            }

            setIsStreaming(false);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: fullResponse,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
            setStreamingText('');
        } catch {
            setIsStreaming(false);
            setStreamingText('');
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-zinc-50/50">
            {/* Chat Area */}
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 overflow-y-auto scroll-smooth px-4 md:px-8">

                    {!hasUserMessages ? (
                        <div className="flex flex-col items-center justify-center min-h-full py-10 space-y-8 max-w-2xl mx-auto">
                            <div className="text-center space-y-4">
                                <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg">
                                    <AvatarImage src={MAX_IMAGE_URL} alt="Max" className="object-cover" />
                                    <AvatarFallback>MX</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Hi, I'm Max.</h1>
                                    <p className="text-violet-600 font-medium mt-1 flex items-center justify-center gap-1.5">
                                        <Sparkles className="h-4 w-4" /> Your GSD SOP Assistant
                                    </p>
                                </div>
                            </div>

                            <div className="w-full pt-4">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center mb-4">
                                    Suggested Questions
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInputText(prompt.query)}
                                            className="flex flex-col items-start text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-violet-300 hover:shadow-md transition-all group"
                                        >
                      <span className="text-sm font-semibold text-zinc-900 group-hover:text-violet-700 transition-colors">
                        {prompt.label}
                      </span>
                                            <span className="text-xs text-zinc-500 mt-1 line-clamp-1">
                        {prompt.query}
                      </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 space-y-2 max-w-4xl mx-auto">
                            {messages.map((msg, idx) => {
                                if (msg.sender === 'bot') {
                                    const prevUserMsg = messages.slice(0, idx).reverse().find(m => m.sender === 'user');
                                    return <MessageBubble key={msg.id} message={msg} previousQuestion={prevUserMsg?.text ?? ''} />;
                                }
                                return <MessageBubble key={msg.id} message={msg} />;
                            })}

                            {isStreaming && streamingText && (
                                <div className="flex w-full mt-4 gap-3 md:gap-4 justify-start">
                                    <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm mt-1">
                                        <AvatarImage src={MAX_IMAGE_URL} alt="Max" className="object-cover" />
                                    </Avatar>
                                    <div className="max-w-[85%] md:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed bg-white text-zinc-800 border border-zinc-200 rounded-2xl rounded-tl-sm shadow-sm">
                                        {streamingText}
                                        <span className="animate-pulse ml-1">▊</span>
                                    </div>
                                </div>
                            )}

                            {isLoading && !isStreaming && (
                                <div className="mt-4">
                                    <TypingIndicator />
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 bg-white border-t border-zinc-200">
                <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-100/50 border border-zinc-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-1 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all">
          <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Max about an SOP..."
              className="w-full bg-transparent border-none outline-none resize-none py-3 max-h-32 text-zinc-900 placeholder-zinc-500 text-[15px] leading-relaxed"
              rows={1}
              disabled={isLoading}
          />
                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        disabled={!inputText.trim() || isLoading}
                        className={`mb-1.5 h-10 w-10 rounded-xl transition-all flex-shrink-0 ${
                            !inputText.trim() || isLoading
                                ? 'bg-zinc-200 text-zinc-400'
                                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md'
                        }`}
                    >
                        <SendHorizontal className="h-5 w-5" />
                    </Button>
                </div>
                <p className="text-center text-[11px] font-medium text-zinc-400 mt-3">
                    Press Enter to send · Shift + Enter for new line
                </p>
            </div>
        </div>
    );
};