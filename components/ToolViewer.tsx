import React from 'react';

interface ToolViewerProps {
    title: string;
    url: string;
    onClose: () => void;
}

export const ToolViewer: React.FC<ToolViewerProps> = ({ title, url, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
            <div className="bg-[#1e1b4b] w-full max-w-6xl h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">

                {/* Header del Modal */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] border-b border-white/10">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Iframe Contenedor */}
                <div className="flex-1 w-full bg-white relative">
                    <iframe
                        src={url}
                        className="w-full h-full border-none"
                        title={title}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                </div>
            </div>
        </div>
    );
};