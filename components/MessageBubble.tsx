import React, { useState, useRef } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  previousQuestion?: string;
}


/** Split response text into main body and an optional source section.
 *  Detects a separator line of 3+ dashes followed by a line starting with **Source:** */
function parseResponse(text: string): { mainText: string; sourceText: string | null } {
  // Try separator + **Source:** pattern
  const sepMatch = text.match(/\n-{3,}\n/);
  if (sepMatch && sepMatch.index !== undefined) {
    const after = text.slice(sepMatch.index + sepMatch[0].length).trim();
    if (/^\*\*Source[:\*]/.test(after)) {
      return { mainText: text.slice(0, sepMatch.index).trim(), sourceText: after };
    }
  }
  // Fallback: plain "Source:" after a newline
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
    } catch {
      // silently ignore network errors
    }
    showConfirmation('Thanks for the feedback ✓');
  };

  const handlePredefinedSelect = (option: string) => {
    setSelectedPredefined(prev => prev === option ? null : option);
  };

  const handleOtherSubmit = async () => {
    const text = otherText.trim();
    const predefined = selectedPredefined;
    if (!text && !predefined) return;
    const errorType = predefined ?? 'Other';
    await submitFeedback(errorType, text);
  };

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const { mainText, sourceText } = isUser
    ? { mainText: message.text, sourceText: null }
    : parseResponse(message.text);

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
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none shadow-sm'
          }`}
        >
          <ReactMarkdown>{mainText}</ReactMarkdown>

          {/* Source card */}
          {sourceText && (
            <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-100 dark:bg-gray-700 rounded-lg p-2.5 mt-4">
              <ReactMarkdown>{sourceText}</ReactMarkdown>
            </div>
          )}
        </div>

        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Feedback row — bot messages only */}
        {!isUser && (
          <div className="relative flex items-center gap-2 mt-1 px-1">
            {confirmation ? (
              <span className="text-[10px] text-green-500">{confirmation}</span>
            ) : (
              <>
                <button
                  onClick={handleThumbsUp}
                  className={`p-2 rounded-lg transition-all text-base leading-none ${
                    feedbackGiven === 'up'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-[#5B21B6] scale-110'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95'
                  }`}
                  aria-label="Thumbs up"
                >
                  👍
                </button>
                <button
                  onClick={handleThumbsDown}
                  className={`p-2 rounded-lg transition-all text-base leading-none ${
                    feedbackGiven === 'down'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-[#5B21B6] scale-110'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95'
                  }`}
                  aria-label="Thumbs down"
                >
                  👎
                </button>
              </>
            )}

            {/* Thumbs-down panel — predefined options + free-form input */}
            {showOtherInput && (
              <div className="absolute left-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-3 min-w-[260px]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">What went wrong?</p>
                <div className="flex flex-col gap-1 mb-3">
                  {PREDEFINED_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => handlePredefinedSelect(option)}
                      className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        selectedPredefined === option
                          ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-[#5B21B6] dark:text-purple-300 font-medium'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Other</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                </div>
                <textarea
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleOtherSubmit(); } }}
                  placeholder="Describe the issue…"
                  rows={3}
                  className="w-full text-xs text-gray-700 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 placeholder-gray-400"
                />
                <button
                  onClick={handleOtherSubmit}
                  disabled={!otherText.trim() && !selectedPredefined}
                  className="mt-1.5 w-full text-xs font-medium py-1.5 rounded-lg bg-[#5B21B6] text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Submit
                </button>
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
