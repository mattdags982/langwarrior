import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Conversation = z.object({
  name: z.string(),
  voiceId: z.enum(['94zOad0g7T7K4oa7zhDq', 'vAxdfYVShGAQEwKYqDZR', '94zOad0g7T7K4oa7zhDq', 'qBvury71WUJfVeT1STkG']),
  contentEnglish: z.string(),
  contentSpanish: z.string(),
});

const Story = z.object({
  title: z.string(),
  description: z.string(),
  conversations: z.array(Conversation),
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "system",
          content: `Create a bilingual conversational story with humor or interesting dialogue, tailored to the user's specific request. The stories will be used for english speakers trying to learn spanish.
          The story should:
          - Adapt to any requested topic, mood, or grammatical tense focus from the user
          - Have 2-4 characters in dialogue
          - Include 6-12 conversation exchanges
          - Provide accurate and natural Spanish translations (not literal translations)
          - Be humorous or interesting
          - Ensure contentSpanish is a proper Spanish translation, not English
          - Use proper Spanish punctuation and accents
          - Make the Spanish translation natural and colloquial, not word-for-word
          - If a specific tense is requested (e.g. past, future, subjunctive), emphasize its usage naturally in the dialogue
          - If a specific topic or mood is requested, build the story and dialogue around it while keeping it natural

          For voice IDs, use:
          - For male characters: '94zOad0g7T7K4oa7zhDq' or 'vAxdfYVShGAQEwKYqDZR'
          - For female characters: '94zOad0g7T7K4oa7zhDq' or 'qBvury71WUJfVeT1STkG'
          
          Ensure each character's voiceId matches their gender in the story.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o",
      response_format: zodResponseFormat(Story, "story")
    });

    const story = completion.choices[0].message.parsed;
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
} 