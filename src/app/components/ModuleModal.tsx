"use client";

import { useState } from "react";
import Spinner from './Spinner';

interface StoryOutline {
  title: string;
  description: string;
}

interface ModuleOutline {
  title: string;
  description: string;
  stories: StoryOutline[];
}

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  moduleOutline: ModuleOutline | null;
  onContinue: () => void;
  onCancel: () => void;
}

const ModuleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  moduleOutline,
  onContinue,
  onCancel
}: ModuleModalProps) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 my-6 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {moduleOutline ? moduleOutline.title : "Generate a Module"}
          </h2>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {!moduleOutline ? (
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your module concept..."
              disabled={isLoading}
            />
          ) : (
            <>
              <p className="text-gray-600">{moduleOutline.description}</p>
              
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Stories in this Module:</h3>
                <div className="space-y-4">
                  {moduleOutline.stories.map((story, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">{story.title}</h4>
                      <p className="text-gray-600 mt-1">{story.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              onClick={moduleOutline ? onCancel : onClose}
              disabled={isLoading}
            >
              {moduleOutline ? "Cancel" : "Close"}
            </button>
            {!moduleOutline ? (
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                onClick={() => {
                  onSubmit(prompt);
                  setPrompt("");
                }}
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all duration-200"
                onClick={onContinue}
              >
                Continue with these Stories
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleModal; 