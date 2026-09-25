"use client";

import React, { useState, useRef } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";

interface MessageBubbleProps {
    message: Message;
    previousQuestion?: string;
}

function parseResponse(text: string): { mainText: string; sourceText: string | null } {
    const sepMatch = text.match(/\n-{3,}\n/);
    if (sepMatch && sepMatch.index !== undefined) {
        const after = text.slice(sepMatch.index + sepMatch[0].length).trim();
        if (/^\*\*Source[:\*]/.test(after)) {
            return { mainText: text.slice(0, sepMatch.index).trim(), sourceText: after };
        }
    }
    const srcIdx = text.search(/\n\*{0,2}Source:/);
    if (srcIdx !== -1) {
        return { mainText: text.slice(0, srcIdx).trim(), sourceText: text.slice(srcIdx).trim() };
    }
    return { mainText: text, sourceText: null };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, previousQuestion = '' }) => {
    const isUser = message.sender === 'user';
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherText, setOtherText] = useState('');
    const [selectedPredefined, setSelectedPredefined] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<string | null>(null);
    const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const PREDEFINED_OPTIONS = ['Incorrect information', 'Incomplete answer', 'Not relevant', 'Unclear response'];

    const showConfirmation = (msg: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setConfirmation(msg);
        timerRef.current = setTimeout(() => setConfirmation(null), 3000);
    };

    const handleThumbsUp = () => {
        setFeedbackGiven('up');
        showConfirmation('Thanks! ✓');
    };

    const handleThumbsDown = () => {
        setFeedbackGiven('down');
        setShowOtherInput(prev => !prev);
    };

    const submitFeedback = async (errorType: string, comment: string) => {
        setShowOtherInput(false);
        setOtherText('');
        setSelectedPredefined(null);
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
                    error_type: errorType,
                    comment,
                }),
            });
        } catch {}
        showConfirmation('Thanks for the feedback ✓');
    };

    const { mainText, sourceText } = isUser
        ? { mainText: message.text, sourceText: null }
        : parseResponse(message.text);

    return (
        <div className={`flex w-full mt-4 gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>

            {!isUser && (
                <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm mt-1">
                    <AvatarImage src="https://i.imgur.com/vReG3a4.jpeg" alt="Max" className="object-cover" />
                    <AvatarFallback>MX</AvatarFallback>
                </Avatar>
            )}

            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`relative px-5 py-3.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap shadow-sm ${
                        isUser
                            ? 'bg-violet-600 text-white rounded-2xl rounded-tr-sm'
                            : message.isError
                                ? 'bg-red-50 text-red-600 border border-red-100 rounded-2xl rounded-tl-sm'
                                : 'bg-white text-zinc-800 border border-zinc-200 rounded-2xl rounded-tl-sm'
                    }`}
                >
                    <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>strong]:font-semibold">
                        <ReactMarkdown>{mainText}</ReactMarkdown>
                    </div>

                    {sourceText && (
                        <div className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-lg p-3 mt-3">
                            <ReactMarkdown>{sourceText}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1.5 px-1">
          <span className="text-[11px] font-medium text-zinc-400">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

                    {!isUser && (
                        <div className="relative flex items-center gap-1 ml-2">
                            {confirmation ? (
                                <span className="text-[11px] font-medium text-emerald-500">{confirmation}</span>
                            ) : (
                                <>
                                    <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${feedbackGiven === 'up' ? 'text-violet-600 bg-violet-50' : 'text-zinc-400 hover:text-zinc-600'}`} onClick={handleThumbsUp}>
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${feedbackGiven === 'down' ? 'text-violet-600 bg-violet-50' : 'text-zinc-400 hover:text-zinc-600'}`} onClick={handleThumbsDown}>
                                        <ThumbsDown className="h-3.5 w-3.5" />
                                    </Button>
                                </>
                            )}

                            {showOtherInput && (
                                <div className="absolute left-0 top-full mt-2 z-10 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 min-w-[280px]">
                                    <p className="text-xs font-semibold text-zinc-900 mb-3">What went wrong?</p>
                                    <div className="flex flex-col gap-1.5 mb-3">
                                        {PREDEFINED_OPTIONS.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setSelectedPredefined(prev => prev === option ? null : option)}
                                                className={`text-left text-xs px-3 py-2 rounded-md border transition-all ${
                                                    selectedPredefined === option
                                                        ? 'border-violet-400 bg-violet-50 text-violet-700 font-medium'
                                                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={otherText}
                                        onChange={e => setOtherText(e.target.value)}
                                        placeholder="Describe the issue..."
                                        rows={2}
                                        className="w-full text-xs text-zinc-700 bg-transparent border border-zinc-200 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500 mb-2"
                                    />
                                    <Button
                                        size="sm"
                                        className="w-full bg-violet-600 hover:bg-violet-700 text-white h-8 text-xs"
                                        disabled={!otherText.trim() && !selectedPredefined}
                                        onClick={() => submitFeedback(selectedPredefined ?? 'Other', otherText.trim())}
                                    >
                                        Submit Feedback
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isUser && (
                <Avatar className="h-8 w-8 border border-zinc-200 shadow-sm mt-1 bg-violet-600">
                    <AvatarFallback className="bg-violet-600 text-white">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};