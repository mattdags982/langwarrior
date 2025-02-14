import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Conversation = z.object({
  name: z.string(),
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
          content: `Create a bilingual conversational story with humor or interesting dialogue.
          The story should:
          - Have 2-4 characters in dialogue
          - Include 6-12 conversation exchanges
          - Keep dialogue lines short and engaging
          - Provide accurate and natural Spanish translations (not literal translations)
          - Be humorous or interesting
          - Ensure contentSpanish is a proper Spanish translation, not English
          - Use proper Spanish punctuation and accents
          - Make the Spanish translation natural and colloquial, not word-for-word`
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