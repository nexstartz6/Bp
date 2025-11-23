import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { PhotoIcon, SparklesIcon } from './Icons';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('Estimate the nutritional value of this meal. Include calories, protein, carbs, and fats.');
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File size must be less than 4MB.');
        return;
      }
      setError('');
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis('');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!imageFile || !prompt.trim()) return;

    setIsLoading(true);
    setAnalysis('');
    setError('');

    try {
        const imageBase64 = await fileToBase64(imageFile);
        const result = await analyzeImage(prompt, imageBase64, imageFile.type);
        setAnalysis(result);
    } catch (err) {
        console.error(err);
        setError('Failed to analyze image. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        {image ? (
          <img src={image} alt="Upload preview" className="h-full w-full object-contain rounded-lg p-1" />
        ) : (
          <>
            <PhotoIcon />
            <p>Click to upload a meal photo</p>
            <p className="text-xs">(Max 4MB)</p>
          </>
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="Enter your analysis prompt..."
      />

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !imageFile}
        className="w-full bg-amber-600 text-white rounded-lg p-3 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors"
      >
        {isLoading ? <LoadingSpinner /> : <SparklesIcon />}
        <span>{isLoading ? 'Analyzing...' : 'Analyze with Gemini'}</span>
      </button>

      {analysis && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-amber-600">Analysis Result</h3>
          <p className="text-sm whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
};