import React, { useState } from 'react';
import { Conversation } from '../src/hooks/useSidebarData';
import { CATEGORIES } from './categories';
import { CategorySection } from './CategorySection';
import { PDF_URLS } from '../src/config/pdfUrls';
import { PDFViewer } from '../src/components/PDFViewer';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onCategoryItemSelect?: (item: string) => void;
  conversations: Conversation[];
  onDeleteConversation: (id: string) => void;
}

const RESOURCES = [
  { label: 'SOP Master Index', url: PDF_URLS['script-reference'] },
  { label: 'Scheduling Guidelines', url: PDF_URLS['scheduling-foundations'] },
];

function formatTimestamp(date: Date): string {
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (isYesterday) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const ChevronIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TrashIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onCategoryItemSelect,
  conversations,
  onDeleteConversation,
}) => {
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-[#1e1b4b] text-white',
          'transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:inset-auto md:z-auto md:h-full md:flex-shrink-0 md:transform-none',
          !isOpen ? 'md:hidden' : '',
        ].join(' ')}
      >
        {/* Sidebar top bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1">

          {/* New Chat */}
          <div className="px-3 pb-1">
            <button onClick={onNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4c1d95] text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-900/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Recent chats */}
          {/* TODO: replace localStorage with Supabase wherever data is persisted. */}
          <div className="px-3 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-2 mb-1.5">
              Recent
            </p>
            {conversations.map((conv) => (
              <div key={conv.id} className="group relative">
                <button
                  onClick={() => setActiveChat(conv.id)}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2 pr-8 rounded-lg text-sm transition-colors ${
                    activeChat === conv.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-shrink-0 opacity-50 mt-0.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{conv.title}</span>
                    <span className="block text-[10px] text-white/30 mt-0.5">{formatTimestamp(conv.timestamp)}</span>
                  </span>
                </button>
                <button
                  onClick={() => onDeleteConversation(conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:text-red-300 transition-opacity"
                  title="Delete conversation"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          <div className="mx-4 my-2 border-t border-white/10" />

          {/* Categories */}
          <div className="px-3 space-y-1">
            {CATEGORIES.map(category => (
              <CategorySection
                key={category.name}
                category={category}
                onItemSelect={onCategoryItemSelect}
              />
            ))}
          </div>

          <div className="mx-4 my-2 border-t border-white/10" />

          {/* Resources */}
          <div className="px-3">
            <button
              onClick={() => setResourcesExpanded(v => !v)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
            >
              <span>Resources</span>
              <ChevronIcon expanded={resourcesExpanded} />
            </button>
            {resourcesExpanded && (
              <div className="mt-1 space-y-0.5">
                {RESOURCES.map(res => (
                  <button
                    key={res.label}
                    onClick={() => setSelectedPDF(res.url)}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-[10px] text-white/25 text-center">GSD Associates © 2025</p>
        </div>
      </aside>
      {selectedPDF && <PDFViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}
    </>
  );
};
