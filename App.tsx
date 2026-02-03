import React from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { ConfigProvider } from './components/ConfigContext';

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <div className="flex flex-col h-full bg-white md:bg-gray-50">
        <div className="flex-none z-10">
          <Header />
        </div>
        <div className="flex-1 overflow-hidden relative flex flex-col items-center">
           <div className="w-full h-full max-w-4xl bg-white md:shadow-xl md:my-4 md:rounded-2xl overflow-hidden flex flex-col border-gray-200 md:border">
              <ChatInterface />
           </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;