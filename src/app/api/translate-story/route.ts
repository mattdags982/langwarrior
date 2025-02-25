import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const InputConversation = z.object({
  name: z.string(),
  contentEnglish: z.string(),
});

const InputStory = z.object({
  title: z.string(),
  description: z.string(),
  conversations: z.array(InputConversation),
});

const OutputConversation = z.object({
  name: z.string(),
  voiceId: z.enum(['94zOad0g7T7K4oa7zhDq', 'vAxdfYVShGAQEwKYqDZR', '94zOad0g7T7K4oa7zhDq', 'qBvury71WUJfVeT1STkG']),
  contentEnglish: z.string(),
  contentSpanish: z.string(),
  contentFrench: z.string(),
  contentItalian: z.string(),
});

const OutputStory = z.object({
  title: z.string(),
  description: z.string(),
  conversations: z.array(OutputConversation),
});

export async function POST(request: Request) {
  try {
    const { story } = await request.json();
    
    // Validate the input story structure
    const parsedInputStory = InputStory.parse(story);

    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "system",
          content: `You are a multilingual translation expert. Your task is to translate the provided English story into Spanish, French, and Italian without changing the story content in any way. You will also assign appropriate voice IDs to each character.

          For voice IDs, use:
          - For male characters: '94zOad0g7T7K4oa7zhDq' or 'vAxdfYVShGAQEwKYqDZR'
          - For female characters: '94zOad0g7T7K4oa7zhDq' or 'qBvury71WUJfVeT1STkG'
          
          For the character named "narration", use '94zOad0g7T7K4oa7zhDq'.
          
          Ensure each character's voiceId matches their gender in the story.
          
          For translations:
          - Provide accurate and natural translations (not literal translations)
          - Use proper punctuation and accents for each language
          - Make the translations natural and colloquial, not word-for-word
          - Preserve the meaning, tone, and style of the original English content`
        },
        {
          role: "user",
          content: JSON.stringify(parsedInputStory)
        }
      ],
      model: "gpt-4o",
      response_format: zodResponseFormat(OutputStory, "story")
    });

    const translatedStory = completion.choices[0].message.parsed;
    return NextResponse.json(translatedStory);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to translate story' },
      { status: 500 }
    );
  }
} 