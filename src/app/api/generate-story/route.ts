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
  voiceIds: z.object({
    spanish: z.enum(['J3JSkWXJwqClE1dIxQM9', 'tomkxGQGz4b1kE0EM722', '94zOad0g7T7K4oa7zhDq', '15bJsujCI3tcDWeoZsQP', 'rBqbBncz61jpuaOTI1GW', 'vAxdfYVShGAQEwKYqDZR', 'MbMvLOFbicjtQwgx0j2r', 'tXgbXPnsMpKXkuTgvE3h', 'gxSxrhNNXvdHpOH0EHjV', 'ypIbR1aohyRSdDv25DPr', 'uDhfdG2VwEjWZ4JYzggn']),
    french: z.enum(['aQROLel5sQbj1vuIVi6B', 'GoEy5CmodqJy0T9AxjLk', 'txtf1EDouKke753vN8SL', 'qMfbtjrTDTlGtBy52G6E', 'b6nVfb3l2zshrLZTvqbs', 'TfGtrgcVrXWjJkeB51T1', 'TTtB1x9U8PF0Vgf20IAP', 'ohItIVrXTBI80RrUECOD', 'Qrl71rx6Yg8RvyPYRGCQ', 'JdwJ7jL68CWmQZuo7KgG', 'wufFsVwuYBePWKO6dMMN']),
    italian: z.enum(['sKbNSlHXq99bttvf8rRF', 'F9w7aaEjfT09qV89OdY8', 'ByVILX2H5wPAwDiNVKAR', '6ZseIH4NYfWg7mfPFOvh', 'W4UCcurKGuUzztgQ7JLv', 'eosUrtWReDe2UiCSc6pa', 'gfKKsLN1k0oYYN9n2dXX', 'fQmr8dTaOQq116mo2X7F', 'kAzI34nYjizE0zON6rXv', '3DPhHWXDY263XJ1d2EPN', '201hPjDVu4Q5DUV7tMQJ']),
  })
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
          content: `Your job is to be a professional creative storyteller. You will be provided the outline of a book (module), and a specific chapter (story) from that book to write.
          You must use best practices to create a high-quality conversational story with humor or interesting dialogue, tailored to the user's specific request.
          
          The story should:
          - Follow the exposition, rising action, climax, falling action, and resolution of the story outline provided
          - Appropriately fit into the outline of module
          - Take into account the previous and next story in the module
          - Adapt to any requested topic, mood, or grammatical tense focus from the user
          - Use the characters provided
          - Include 6-16 conversation exchanges
          - Be humorous or interesting
          - Be written in a "play" style where speech is assigned to a character
          - Any parts of the story that are not direct speech should be assigned to a character named "narration". This is the ONLY character you can use that is not provided.
          - NEVER put any text in parentheses such as "(looking worried) I don't know what to do." Emotions should be conveyed through dialogue.
          - If a specific tense is requested (e.g. past, future, subjunctive), emphasize its usage naturally in the dialogue
          - If a specific topic or mood is requested, build the story and dialogue around it while keeping it natural
          - Use the voiceIds provided for each character`
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