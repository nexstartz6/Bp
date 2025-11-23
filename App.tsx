import React, { useState } from 'react';
import { ARView } from './components/ARView';
import { AITools } from './components/AITools';
import { CameraIcon, SparklesIcon } from './components/Icons';

type View = 'ar' | 'ai';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('ar');

  const NavButton: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs sm:text-sm transition-colors duration-200 ${
        currentView === view
          ? 'text-amber-600 font-semibold'
          : 'text-gray-500 hover:text-amber-500'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-sm text-center p-4 shadow-lg shadow-amber-500/10 sticky top-0 z-20">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-amber-600">
          AR Health Monitor <span className="text-gray-800">&</span> Gemini AI
        </h1>
      </header>

      <main className="flex-grow relative">
        {currentView === 'ar' && <ARView />}
        {currentView === 'ai' && <AITools />}
      </main>

      <nav className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-amber-500/20 shadow-2xl z-20">
        <div className="max-w-md mx-auto flex justify-around">
          <NavButton view="ar" label="AR Monitor" icon={<CameraIcon />} />
          <NavButton view="ai" label="Gemini Tools" icon={<SparklesIcon />} />
        </div>
      </nav>
    </div>
  );
};

export default App;