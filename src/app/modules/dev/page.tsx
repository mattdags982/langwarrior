"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { publishStory } from '@/app/services/storyService';

const Spinner = () => (
  <div className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
  </div>
);

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const StoryModal = ({ isOpen, onClose, onSubmit, isLoading = false }: StoryModalProps) => {
  const [prompt, setPrompt] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Generate a Story</h2>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            disabled={isLoading}
          />
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

interface Conversation {
  name: string;
  contentEnglish: string;
  contentSpanish: string;
}

interface StoryResponse {
  story: {
    title: string;
    description: string;
    conversations: Conversation[];
  }
}

export default function Dev() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [story, setStory] = useState<StoryResponse['story'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const generateStory = async (prompt: string) => {
    setIsLoading(true);
    try {
      console.log('Generating story with prompt:', prompt);
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.error) {
        console.error('Error:', data.error);
        throw new Error(data.error);
      }
      
      setStory(data);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handlePublish = async () => {
    if (!story) return;
    
    setIsPublishing(true);
    try {
      const result = await publishStory(story);
      console.log('Story published successfully:', result);
      setStory(null);
      alert('Story published successfully!');
    } catch (error) {
      console.error('Error publishing story:', error);
      alert('Failed to publish story. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard this story?')) {
      setStory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-0.5rem)]">
        {!story && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex gap-4">
              <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
                {({ open }) => (
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm text-lg"
                    onClick={() => open()}
                  >
                    Upload an Image
                  </button>
                )}
              </CldUploadWidget>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-sm text-lg"
                onClick={() => setIsModalOpen(true)}
              >
                Story Generator
              </button>
            </div>
          </div>
        )}

        {story && (
          <div className="w-full max-w-4xl px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h2>
                <p className="text-gray-600 text-lg mb-6">{story.description}</p>
                <div className="space-y-6">
                  {story.conversations.map((conv, index) => (
                    <div key={index} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="font-semibold text-gray-900 mb-2">{conv.name}</div>
                      <div className="space-y-3">
                        <p className="text-gray-800 leading-relaxed">{conv.contentEnglish}</p>
                        <p className="text-gray-600 italic">{conv.contentSpanish}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    onClick={handleCancel}
                    disabled={isPublishing}
                  >
                    Discard
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing && <Spinner />}
                    {isPublishing ? 'Publishing...' : 'Publish Story'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <StoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={generateStory}
        isLoading={isLoading}
      />
    </div>
  );
}
