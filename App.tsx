import React, { useState, useEffect } from 'react';
import { Message } from './types';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConfigProvider, useConfig } from './components/ConfigContext';
import { useSidebarData } from './src/hooks/useSidebarData';

const AppContent: React.FC = () => {
  const { config } = useConfig();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const {
    conversations,
    addConversation,
    deleteConversation,
  } = useSidebarData();

  // Keep welcome message in sync with config (and set it on first mount)
  useEffect(() => {
    setMessages(prev => {
      const rest = prev.filter(m => m.id !== 'welcome');
      return [
        { id: 'welcome', text: config.welcomeMessage, sender: 'bot', timestamp: new Date() },
        ...rest,
      ];
    });
  }, [config.welcomeMessage]);

  const handleNewChat = () => {
    setMessages([
      { id: 'welcome', text: config.welcomeMessage, sender: 'bot', timestamp: new Date() },
    ]);
    setExternalPrompt(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* Header — full width, sits above sidebar+content */}
      <div className="flex-none z-40 relative">
        <Header onMenuClick={() => setSidebarOpen(v => !v)} />
      </div>

      {/* Body: sidebar + chat panel */}
      <div className="flex flex-1 overflow-hidden">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onCategoryItemSelect={(item) => setExternalPrompt(`What are the SOPs for ${item}?`)}
          conversations={conversations}
          onDeleteConversation={deleteConversation}
        />

        {/* Main chat column */}
        <main className="flex-1 overflow-hidden flex flex-col min-w-0 md:p-4">
          <div className="flex-1 overflow-hidden flex flex-col bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200">
            <ChatInterface
              messages={messages}
              setMessages={setMessages}
              externalPrompt={externalPrompt}
              onExternalPromptHandled={() => setExternalPrompt(null)}
              onConversationSaved={addConversation}
            />
          </div>
        </main>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
};

export default App;
