import React, { useState } from 'react';
import { Chatbot } from './Chatbot';
import { ImageAnalyzer } from './ImageAnalyzer';
import { QuickAnalysis } from './QuickAnalysis';
import { AITool } from '../types';
import { ChatBubbleIcon, PhotoIcon, BoltIcon } from './Icons';

const TabButton: React.FC<{
  label: string;
  tool: AITool;
  activeTool: AITool;
  onClick: (tool: AITool) => void;
  icon: React.ReactNode;
}> = ({ label, tool, activeTool, onClick, icon }) => (
  <button
    onClick={() => onClick(tool)}
    className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium border-b-2 transition-all duration-300 ${
      activeTool === tool
        ? 'border-amber-500 text-amber-600 bg-amber-50'
        : 'border-transparent text-gray-500 hover:bg-amber-50/50 hover:text-amber-600'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export const AITools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AITool>(AITool.Chat);

  const renderTool = () => {
    switch (activeTool) {
      case AITool.Chat:
        return <Chatbot />;
      case AITool.Image:
        return <ImageAnalyzer />;
      case AITool.Quick:
        return <QuickAnalysis />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] bg-white">
      <div className="flex border-b border-gray-200">
        <TabButton
          label="Health Chatbot"
          tool={AITool.Chat}
          activeTool={activeTool}
          onClick={setActiveTool}
          icon={<ChatBubbleIcon />}
        />
        <TabButton
          label="Meal Analyzer"
          tool={AITool.Image}
          activeTool={activeTool}
          onClick={setActiveTool}
          icon={<PhotoIcon />}
        />
        <TabButton
          label="Quick Query"
          tool={AITool.Quick}
          activeTool={activeTool}
          onClick={setActiveTool}
          icon={<BoltIcon />}
        />
      </div>
      <div className="flex-grow overflow-y-auto p-4">{renderTool()}</div>
    </div>
  );
};