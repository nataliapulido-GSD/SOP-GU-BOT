import React, { useState } from 'react';
import { useConfig } from './ConfigContext';

export const Header: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // SVG Icons
  const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#667eea]">
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </svg>
  );

  return (
    <>
      <header className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] border-b border-transparent py-3 px-4 shadow-sm w-full">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20">
               {config.logoUrl ? (
                 <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" onError={(e) => {
                   (e.target as HTMLImageElement).style.display = 'none';
                   (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                 }} />
               ) : null}
               <div className={`${config.logoUrl ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
                 <BotIcon />
               </div>
            </div>
            <div>
              <h1 className="font-semibold text-white text-lg">{config.botName}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs text-blue-50 font-medium">Online</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-white/90 hover:bg-white/20 rounded-full transition-colors"
            title="Configuration"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>
      
      {/* Settings Modal/Dropdown */}
      {isSettingsOpen && (
        <div className="absolute top-16 right-0 md:right-[calc(50%-20rem)] z-50 p-4 w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Configuration</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Webhook URL</label>
              <input 
                type="text" 
                value={config.webhookUrl} 
                onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-[#667eea] focus:border-[#667eea] outline-none"
                placeholder="https://n8n.instance..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Logo URL</label>
              <input 
                type="text" 
                value={config.logoUrl} 
                onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-[#667eea] focus:border-[#667eea] outline-none"
                placeholder="https://..."
              />
            </div>
            
             <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Welcome Message</label>
              <input 
                type="text" 
                value={config.welcomeMessage} 
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-[#667eea] focus:border-[#667eea] outline-none"
              />
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Save and Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};