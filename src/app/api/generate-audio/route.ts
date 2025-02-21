import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { base64ToBuffer, stitchAudioFiles } from './audioUtils';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;

async function generateSpeech(
  text: string, 
  voiceId: string,
  previousText?: string,
  nextText?: string
) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
        previous_text: previousText,
        next_text: nextText
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate speech: ${response.statusText}`);
  }

  return response.arrayBuffer();
}

export async function POST(request: Request) {
  try {
    const { conversations } = await request.json();
    console.log('Processing conversations for audio generation...');
    
    // Generate audio for each conversation
    const audioBuffers: Buffer[] = [];
    
    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      console.log(`Generating audio for ${conv.name} using voice ${conv.voiceId}`);
      
      // Get previous and next text for stitching
      const previousText = i > 0 ? conversations[i - 1].contentSpanish : undefined;
      const nextText = i < conversations.length - 1 ? conversations[i + 1].contentSpanish : undefined;
      
      const audioBuffer = await generateSpeech(
        conv.contentSpanish, 
        conv.voiceId,
        previousText,
        nextText
      );
      audioBuffers.push(Buffer.from(audioBuffer));
    }

    // Stitch audio files together
    console.log('Stitching audio files together...');
    const finalAudio = await stitchAudioFiles(audioBuffers);

    // Save the final audio file locally
    const outputPath = join(process.cwd(), 'public', 'generated-audio');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `story-${timestamp}.mp3`;
    const filePath = join(outputPath, fileName);
    
    await writeFile(filePath, finalAudio);
    console.log(`Audio saved to: ${filePath}`);

    return NextResponse.json({ 
      success: true,
      audioPath: `/generated-audio/${fileName}` 
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
} 