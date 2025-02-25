import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveAudioToStorage } from './saveAudioFile';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title, description, conversations, audioPath, module } = await request.json();

    if (!audioPath) {
      throw new Error('No audioPath provided');
    }

    console.log('Received audioPath:', audioPath);

    // Upload audio to Cloudinary and get the public_id
    const cloudinaryPublicId = await saveAudioToStorage(audioPath);
    console.log('Uploaded to Cloudinary with public_id:', cloudinaryPublicId);

    let prismaModule;
    if (module) {
      if (module.id) {
        // Use existing module if id is provided
        prismaModule = await prisma.module.findUnique({
          where: { id: module.id }
        });
        
        if (!prismaModule) {
          throw new Error('Module not found');
        }
      } else {
        // Create a new module with the provided details
        prismaModule = await prisma.module.create({
          data: {
            title: module.title,
            description: module.description,
            difficultyRating: 1, // You might want to make this configurable
            category: 'generated', // You might want to make this configurable
          },
        });
      }
    } else {
      // Use the default test module if no module is provided
      const existingModule = await prisma.module.findFirst({
        where: {
          title: 'test gen stories',
        },
      });

      prismaModule = await prisma.module.upsert({
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
    }

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
              create: [
                {
                  languageCode: 'es',
                  translatedContent: conv.contentSpanish,
                },
                {
                  languageCode: 'fr',
                  translatedContent: conv.contentFrench,
                },
                {
                  languageCode: 'it',
                  translatedContent: conv.contentItalian,
                }
              ],
            },
          },
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      chapterId: chapter.id,
      audioLink: cloudinaryPublicId,
      moduleId: prismaModule.id
    });
  } catch (error) {
    console.error('Error in publish-story:', error);
    return NextResponse.json({ 
      error: 'Failed to publish story', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 