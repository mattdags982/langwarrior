"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { publishStory } from '@/app/services/storyService';
import StoryModal from '@/app/components/StoryModal';
import ModuleModal from '@/app/components/ModuleModal';
import Spinner from '@/app/components/Spinner';

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

interface StoryOutline {
  title: string;
  description: string;
}

interface ModuleOutline {
  title: string;
  description: string;
  stories: StoryOutline[];
}

export default function Dev() {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [story, setStory] = useState<StoryResponse['story'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [moduleOutline, setModuleOutline] = useState<ModuleOutline | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(-1);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  const generateModule = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error:', data.error);
        throw new Error(data.error);
      }
      
      setModuleOutline(data);
    } catch (error) {
      console.error('Error generating module:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsStoryModalOpen(false);
    }
  };

  const handlePublish = async () => {
    if (!story) return;
    
    setIsPublishing(true);
    try {
      const result = await publishStory(
        story,
        moduleOutline ? {
          title: moduleOutline.title,
          description: moduleOutline.description,
          id: currentModuleId
        } : undefined
      );
      
      console.log('Story published successfully:', result);
      
      // If this is the first story in a module, store the moduleId
      if (moduleOutline && currentStoryIndex === 0) {
        setCurrentModuleId(result.moduleId);
      }
      
      setStory(null);
      
      // If we're generating stories from a module, move to the next story
      if (moduleOutline && currentStoryIndex >= 0) {
        if (currentStoryIndex < moduleOutline.stories.length - 1) {
          const nextIndex = currentStoryIndex + 1;
          setCurrentStoryIndex(nextIndex);
          setIsStoryModalOpen(true);
        } else {
          // We've published all stories in the module
          setModuleOutline(null);
          setCurrentStoryIndex(-1);
          setCurrentModuleId(null);
          alert('All stories in the module have been published!');
        }
      } else {
        alert('Story published successfully!');
      }
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
      if (moduleOutline) {
        setModuleOutline(null);
        setCurrentStoryIndex(-1);
        setCurrentModuleId(null);
      }
    }
  };

  const handleModuleContinue = () => {
    setIsModuleModalOpen(false);
    setCurrentStoryIndex(0);
    setIsStoryModalOpen(true);
  };

  const handleModuleCancel = () => {
    if (window.confirm('Are you sure you want to discard this module?')) {
      setModuleOutline(null);
      setCurrentStoryIndex(-1);
      setCurrentModuleId(null);
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
                onClick={() => setIsStoryModalOpen(true)}
              >
                Story Generator
              </button>

              <button
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 shadow-sm text-lg"
                onClick={() => setIsModuleModalOpen(true)}
              >
                Module Generator
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
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onSubmit={generateStory}
        isLoading={isLoading}
        currentStory={moduleOutline && currentStoryIndex >= 0 ? moduleOutline.stories[currentStoryIndex] : null}
      />

      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSubmit={generateModule}
        isLoading={isLoading}
        moduleOutline={moduleOutline}
        onContinue={handleModuleContinue}
        onCancel={handleModuleCancel}
      />
    </div>
  );
}
