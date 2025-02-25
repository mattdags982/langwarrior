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
          content: `Create a high-quality conversational story with humor or interesting dialogue, tailored to the user's specific request.
          The story should:
          - Adapt to any requested topic, mood, or grammatical tense focus from the user
          - Have 2-4 characters in dialogue
          - Include 6-12 conversation exchanges
          - Be humorous or interesting
          - Be written in a "play" style where speech is assigned to a character
          - Any parts of the story that are not direct speech should be assigned to a character named "narration"
          - If a specific tense is requested (e.g. past, future, subjunctive), emphasize its usage naturally in the dialogue
          - If a specific topic or mood is requested, build the story and dialogue around it while keeping it natural`
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