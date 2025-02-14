import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { base64ToBuffer, stitchAudioFiles } from './audioUtils';

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_IDS = {
  male1: 'pNInz6obpgDQGcFmaJgB', // Adam
  male2: 'yoZ06aMxZJJ28mfd3POQ', // Josh
  female1: 'EXAVITQu4vr4xnSDxMaL', // Sarah
  female2: '21m00Tcm4TlvDq8ikWAM', // Rachel
};

async function generateSpeech(text: string, voiceId: string) {
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
    
    // Map character names to voice IDs
    const characterVoices = new Map<string, string>();
    let voiceIndex = 0;
    const voiceIds = Object.values(VOICE_IDS);

    // Generate audio for each conversation
    const audioBuffers: Buffer[] = [];
    
    for (const conv of conversations) {
      // Assign a consistent voice to each character
      if (!characterVoices.has(conv.name)) {
        characterVoices.set(conv.name, voiceIds[voiceIndex % voiceIds.length]);
        voiceIndex++;
      }

      const voiceId = characterVoices.get(conv.name)!;
      console.log(`Generating audio for ${conv.name} using voice ${voiceId}`);
      
      const audioBuffer = await generateSpeech(conv.contentSpanish, voiceId);
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