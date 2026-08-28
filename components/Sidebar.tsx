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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
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

    // Common styles for section headers
    const sectionHeaderClass = "w-full flex items-center justify-between px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5 cursor-pointer group";

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={onClose} />
            )}

            {/* Sidebar panel */}
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 w-72 flex flex-col bg-[#110e2d] text-white shadow-2xl shadow-black',
                    'transition-transform duration-300 ease-in-out border-r border-white/5',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'md:relative md:inset-auto md:z-auto md:h-full md:flex-shrink-0 md:transform-none',
                    !isOpen ? 'md:hidden' : '',
                ].join(' ')}
            >
                {/* Sidebar top bar */}
                <div className="flex items-center justify-between px-5 py-4 bg-[#16133a] border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#9333EA] flex items-center justify-center shadow-lg shadow-purple-900/50 border border-white/10">
                            <span className="text-sm font-black tracking-tighter text-white">G</span>
                        </div>
                        <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/90 leading-tight">
                SOP Bot
              </span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest font-medium">
                Knowledge Base
              </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 custom-scrollbar">

                    {/* New Chat Button */}
                    <div className="px-1">
                        <button
                            onClick={onNewChat}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4c1d95] hover:to-[#6D28D9] text-white text-sm font-semibold transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5 border border-purple-500/20"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Conversation
                        </button>
                    </div>

                    {/* Recent Chats Section */}
                    <div>
                        <div className="px-2 mb-2 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-400/50"></span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Recent Chats</p>
                        </div>
                        <div className="space-y-0.5">
                            {conversations.slice(0, 5).map((conv) => (
                                <div key={conv.id} className="group relative">
                                    <button
                                        onClick={() => setActiveChat(conv.id)}
                                        className={`w-full text-left flex items-start gap-3 px-3 py-2 pr-9 rounded-lg text-sm transition-all border ${
                                            activeChat === conv.id
                                                ? 'bg-[#1e1b4b] border-purple-500/30 text-white shadow-sm'
                                                : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 mt-0.5 transition-colors ${activeChat === conv.id ? 'text-purple-400' : 'opacity-40'}`}>
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{conv.title}</span>
                      <span className={`block text-[10px] mt-0.5 ${activeChat === conv.id ? 'text-purple-300/70' : 'text-white/30'}`}>
                        {formatTimestamp(conv.timestamp)}
                      </span>
                    </span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/20"
                                        title="Delete conversation"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <p className="px-3 py-2 text-xs text-white/30 italic">No recent chats</p>
                            )}
                        </div>
                    </div>

                    <div className="mx-2 border-t border-white/5" />

                    {/* Categories / SOPs Section */}
                    <div>
                        <div className="px-2 mb-2 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-purple-400/50"></span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Knowledge Base</p>
                        </div>
                        <div className="space-y-0.5">
                            {CATEGORIES.map(category => (
                                <CategorySection
                                    key={category.name}
                                    category={category}
                                    onItemSelect={onCategoryItemSelect}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mx-2 border-t border-white/5" />

                    {/* Interactive Tools Section */}
                    <div>
                        <button onClick={() => setToolsExpanded(v => !v)} className={sectionHeaderClass}>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400/50 group-hover:bg-emerald-400 transition-colors"></span>
                Interactive Tools
              </span>
                            <ChevronIcon expanded={toolsExpanded} />
                        </button>

                        {toolsExpanded && (
                            <div className="mt-1 space-y-0.5">
                                {INTERACTIVE_TOOLS.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setSelectedTool({ title: tool.label, url: tool.url })}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/5"
                                    >
                                        <span className="text-base drop-shadow-md">{tool.icon}</span>
                                        <span className="font-medium">{tool.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resources Section */}
                    <div>
                        <button onClick={() => setResourcesExpanded(v => !v)} className={sectionHeaderClass}>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-400/50 group-hover:bg-orange-400 transition-colors"></span>
                PDF Resources
              </span>
                            <ChevronIcon expanded={resourcesExpanded} />
                        </button>

                        {resourcesExpanded && (
                            <div className="mt-1 space-y-0.5">
                                {RESOURCES.map(res => (
                                    <button
                                        key={res.label}
                                        onClick={() => setSelectedPDF(res.url)}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/5"
                                    >
                                        <span className="text-base opacity-70 grayscale">{res.icon}</span>
                                        <span className="font-medium">{res.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-[#16133a] border-t border-white/5 shrink-0 flex justify-between items-center">
                    <p className="text-[10px] text-white/30 font-medium tracking-wide">GSD ASSOCIATES © 2025</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
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