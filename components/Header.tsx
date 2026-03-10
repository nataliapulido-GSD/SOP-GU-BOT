import React, { useState } from 'react';
import { useConfig } from './ConfigContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { config, updateConfig } = useConfig();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 py-2.5 px-4 w-full">
        <div className="flex items-center justify-between gap-4">

          {/* Left: hamburger + GSD logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              title="Toggle sidebar"
            >
              <MenuIcon />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src={config.logoUrl}
                alt="GSD Associates"
                className="h-8 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="hidden sm:block border-l border-gray-200 pl-2.5">
                <p className="text-sm font-bold text-gray-900 leading-tight">GSD Associates</p>
                <p className="text-[11px] text-gray-400 leading-tight">Georgia Urology</p>
              </div>
            </div>
          </div>

          {/* Center: Max bot identity */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#5B21B6' }}
            >
              <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 400, lineHeight: 1 }}>M</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{config.botName}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Right: settings gear */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Configuration"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* Settings modal — positioned relative to parent wrapper in App.tsx */}
      {isSettingsOpen && (
        <div className="absolute top-full right-4 mt-1 z-50 w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Configuration</h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Webhook URL</label>
              <input
                type="text"
                value={config.webhookUrl}
                onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B21B6]/30 focus:border-[#5B21B6] outline-none transition-all"
                placeholder="https://n8n.instance..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Logo URL</label>
              <input
                type="text"
                value={config.logoUrl}
                onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B21B6]/30 focus:border-[#5B21B6] outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Welcome Message</label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B21B6]/30 focus:border-[#5B21B6] outline-none transition-all"
              />
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-[#5B21B6] hover:bg-[#4c1d95] text-white py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Save and Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
