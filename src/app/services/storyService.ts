import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Story {
  title: string;
  description: string;
  conversations: Array<{
    name: string;
    voiceId: string;
    contentEnglish: string;
    contentSpanish: string;
    contentFrench: string;
    contentItalian: string;
  }>;
}

interface Module {
  title: string;
  description: string;
  id?: string | null;
}

export async function publishStory(story: Story, module?: Module) {
  // First generate audio for all conversations
  const audioResponse = await fetch('/api/generate-audio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversations: story.conversations }),
  });

  const audioData = await audioResponse.json();
  if (!audioResponse.ok) throw new Error(audioData.error);

  // Then publish the story with audio data
  const response = await fetch('/api/publish-story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...story,
      audioPath: audioData.audioPath,
      module: module || null,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
} 