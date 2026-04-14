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
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-2.5 px-4 w-full">
        <div className="flex items-center justify-between gap-4">

          {/* Left: hamburger + GSD logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700 pl-2.5">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">GSD Associates</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Georgia Urology</p>
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
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{config.botName}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Right: settings gear */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Configuration"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* Settings modal — full-screen backdrop + centered panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSettingsOpen(false)}
          />
          {/* Modal panel */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 w-full max-w-sm">
            {/* Header row with title and X button */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Configuration</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close settings"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Welcome Message</label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                className="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#5B21B6]/30 focus:border-[#5B21B6] outline-none"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dark Mode</label>
              <button
                role="switch"
                aria-checked={config.darkMode}
                onClick={() => updateConfig({ darkMode: !config.darkMode })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config.darkMode ? 'bg-[#5B21B6]' : 'bg-gray-200 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${config.darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
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
