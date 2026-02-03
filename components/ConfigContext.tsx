import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

interface ConfigContextType {
  config: ChatConfig;
  updateConfig: (newConfig: Partial<ChatConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ChatConfig>(DEFAULT_CONFIG);

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