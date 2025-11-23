import React, { useState } from 'react';
import { getQuickAnalysis } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { BoltIcon } from './Icons';

export const QuickAnalysis: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await getQuickAnalysis(prompt);
      setResult(response);
    } catch (error) {
      setResult('Sorry, an error occurred during the analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">Fast AI Query</h2>
      <p className="text-sm text-gray-500 text-center">
        Get a quick response from Gemini Flash Lite. Perfect for simple questions, summaries, or ideas.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="e.g., 'List 5 healthy breakfast ideas high in protein'"
      />
      <button
        onClick={handleAnalyze}
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-amber-600 rounded-lg p-3 text-white font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors"
      >
        {isLoading ? <LoadingSpinner /> : <BoltIcon />}
        <span>{isLoading ? 'Processing...' : 'Get Fast Response'}</span>
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-amber-600">Response</h3>
          <p className="text-sm whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};