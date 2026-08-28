import React, { useState } from 'react';
import { Conversation } from '../src/hooks/useSidebarData';
import { CATEGORIES } from './categories';
import { CategorySection } from './CategorySection';
import { PDF_URLS } from '../src/config/pdfUrls';
import { PDFViewer } from '../src/components/PDFViewer';
import { ToolViewer } from './ToolViewer';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNewChat: () => void;
    onCategoryItemSelect?: (item: string) => void;
    conversations: Conversation[];
    onDeleteConversation: (id: string) => void;
}

const RESOURCES = [
    { label: 'SOP Master Index', url: PDF_URLS['script-reference'], icon: '📄' },
    { label: 'Scheduling Guidelines', url: PDF_URLS['scheduling-foundations'], icon: '📅' },
];

const INTERACTIVE_TOOLS = [
    { id: 'stones', label: 'Stones Guide', url: '/tools/GSD_Stones_Interactive.html', icon: '🪨' },
    { id: 'gau', label: 'GAU Routing Guide', url: '/tools/GAU_Interactive_Guide.html', icon: '🧭' },
    { id: 'phone-note', label: 'Phone Note Guide', url: '/tools/GSD_Phone_Note_Guide.html', icon: '📝' },
    { id: 'notepad', label: 'Call Notepad', url: '/tools/GSD_Call_Notepad_and_Appointment_Details.html', icon: '📞' },
    { id: 'nextgen', label: 'NextGen PM Guide', url: '/tools/NextGen_PM_Interactive_Guide.html', icon: '🖥️' },
    { id: 'scheduling', label: 'Scheduling Foundations', url: '/tools/Scheduling_Foundations_Interactive_Guide.html', icon: '📆' }
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" />
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
    const [toolsExpanded, setToolsExpanded] = useState(true);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<{title: string, url: string} | null>(null);

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={onClose} />
            )}

            {/* Sidebar panel */}
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 w-72 flex flex-col bg-[#141235] text-white shadow-2xl shadow-black',
                    'transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'md:relative md:inset-auto md:z-auto md:h-full md:flex-shrink-0 md:transform-none',
                    !isOpen ? 'md:hidden' : '',
                ].join(' ')}
            >
                {/* Sidebar top bar */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#1e1b4b] border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#5B21B6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-900/50">
                            <span className="text-xs font-bold">G</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              SOP Bot
            </span>
                    </div>
                    <button onClick={onClose} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">

                    {/* New Chat */}
                    <div className="px-4 pb-2">
                        <button
                            onClick={onNewChat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#6D28D9] hover:from-[#4c1d95] hover:to-[#5B21B6] text-white text-sm font-semibold transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:-translate-y-0.5"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Conversation
                        </button>
                    </div>

                    {/* Interactive Tools (NEW) */}
                    <div className="px-4 pt-2">
                        <button
                            onClick={() => setToolsExpanded(v => !v)}
                            className="w-full flex items-center justify-between px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400/80 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/5 group"
                        >
              <span className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                Interactive Tools
              </span>
                            <ChevronIcon expanded={toolsExpanded} />
                        </button>

                        {toolsExpanded && (
                            <div className="mt-1 mb-3 space-y-1">
                                {INTERACTIVE_TOOLS.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setSelectedTool({ title: tool.label, url: tool.url })}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors border border-transparent hover:border-emerald-500/20"
                                    >
                                        <span className="text-base">{tool.icon}</span>
                                        <span className="font-medium">{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mx-6 my-2 border-t border-white/5" />

                    {/* Recent chats */}
                    <div className="px-4 pt-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 px-2 mb-2">
                            Recent Chats
                        </p>
                        {conversations.slice(0, 5).map((conv) => (
                            <div key={conv.id} className="group relative">
                                <button
                                    onClick={() => setActiveChat(conv.id)}
                                    className={`w-full text-left flex items-start gap-3 px-3 py-2.5 pr-8 rounded-lg text-sm transition-all ${
                                        activeChat === conv.id
                                            ? 'bg-white/10 text-white shadow-inner'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 opacity-40 mt-0.5">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{conv.title}</span>
                    <span className="block text-[10px] text-white/40 mt-0.5">{formatTimestamp(conv.timestamp)}</span>
                  </span>
                                </button>
                                <button
                                    onClick={() => onDeleteConversation(conv.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                                    title="Delete conversation"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mx-6 my-2 border-t border-white/5" />

                    {/* Categories */}
                    <div className="px-4 space-y-1">
                        {CATEGORIES.map(category => (
                            <CategorySection
                                key={category.name}
                                category={category}
                                onItemSelect={onCategoryItemSelect}
                            />
                        ))}
                    </div>

                    <div className="mx-6 my-2 border-t border-white/5" />

                    {/* Resources */}
                    <div className="px-4">
                        <button
                            onClick={() => setResourcesExpanded(v => !v)}
                            className="w-full flex items-center justify-between px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
                        >
                            <span>Resources</span>
                            <ChevronIcon expanded={resourcesExpanded} />
                        </button>
                        {resourcesExpanded && (
                            <div className="mt-1 space-y-1">
                                {RESOURCES.map(res => (
                                    <button
                                        key={res.label}
                                        onClick={() => setSelectedPDF(res.url)}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <span className="text-base opacity-70">{res.icon}</span>
                                        {res.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-[#1e1b4b] border-t border-white/5">
                    <p className="text-[11px] text-white/30 text-center font-medium">GSD Associates © 2025</p>
                </div>
            </aside>

            {/* Modals */}
            {selectedPDF && <PDFViewer pdfUrl={selectedPDF} onClose={() => setSelectedPDF(null)} />}

            {selectedTool && (
                <ToolViewer
                    title={selectedTool.title}
                    url={selectedTool.url}
                    onClose={() => setSelectedTool(null)}
                />
            )}
        </>
    );
};