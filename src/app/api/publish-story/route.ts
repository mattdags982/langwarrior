import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveAudioToStorage } from './saveAudioFile';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title, description, conversations, audioPath } = await request.json();

    if (!audioPath) {
      throw new Error('No audioPath provided');
    }

    console.log('Received audioPath:', audioPath);

    // Upload audio to Cloudinary and get the public_id
    const cloudinaryPublicId = await saveAudioToStorage(audioPath);
    console.log('Uploaded to Cloudinary with public_id:', cloudinaryPublicId);

    // First find existing module
    const existingModule = await prisma.module.findFirst({
      where: {
        title: 'test gen stories',
      },
    });

    // Create or update module
    const prismaModule = await prisma.module.upsert({
      where: {
        id: existingModule?.id || 'temp-id',
      },
      update: {},
      create: {
        title: 'test gen stories',
        description: 'Generated conversation stories for testing',
        difficultyRating: 1,
        category: 'practice',
      },
    });

    // Create chapter with Cloudinary public_id as audioLink
    const chapter = await prisma.chapter.create({
      data: {
        moduleId: prismaModule.id,
        title,
        description,
        audioLink: cloudinaryPublicId,
      },
    });

    // Create blurbs without individual audio files
    await Promise.all(
      conversations.map(async (conv: any, index: number) => {
        return prisma.blurb.create({
          data: {
            chapterId: chapter.id,
            sequence: index + 1,
            characterName: conv.name,
            contentEnglish: conv.contentEnglish,
            translations: {
              create: {
                languageCode: 'es',
                translatedContent: conv.contentSpanish,
              },
            },
          },
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      chapterId: chapter.id,
      audioLink: cloudinaryPublicId 
    });
  } catch (error) {
    console.error('Error in publish-story:', error);
    return NextResponse.json({ 
      error: 'Failed to publish story', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 