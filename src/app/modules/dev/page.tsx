"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { publishStory } from '@/app/services/storyService';

const Spinner = () => (
  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Generate a Story</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your story prompt..."
          disabled={isLoading}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 disabled:bg-blue-300"
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
      
      // The response now includes the story object directly
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
      // Clear the story after successful publish
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="space-y-4 w-full max-w-2xl">
        <div className="flex gap-4">
          <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
            {({ open }) => (
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => open()}
              >
                Upload an Image
              </button>
            )}
          </CldUploadWidget>
          
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Story Generator
          </button>
        </div>

        {story && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
            <p className="text-gray-600 mb-4">{story.description}</p>
            <div className="space-y-4">
              {story.conversations.map((conv, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="font-semibold text-gray-700">{conv.name}</div>
                  <div className="pl-4 space-y-2">
                    <div className="bg-white p-2 rounded">
                      <p className="text-gray-800">{conv.contentEnglish}</p>
                      <p className="text-gray-600 italic mt-1">{conv.contentSpanish}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={handleCancel}
                disabled={isPublishing}
              >
                Discard
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 flex items-center gap-2"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing && <Spinner />}
                {isPublishing ? 'Publishing...' : 'Publish Story'}
              </button>
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
