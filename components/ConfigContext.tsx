import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const DARK_MODE_KEY = 'gsd_darkMode';

interface ConfigContextType {
  config: ChatConfig;
  updateConfig: (newConfig: Partial<ChatConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ChatConfig>(() => {
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY);
      return { ...DEFAULT_CONFIG, darkMode: stored === 'true' };
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Sync dark mode preference to localStorage and <html> class
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, String(config.darkMode));
    } catch {}
    if (config.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.darkMode]);

  const updateConfig = (newConfig: Partial<ChatConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
