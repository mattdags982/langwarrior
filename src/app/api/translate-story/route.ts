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
  voiceIds: z.object({
    spanish: z.enum(['J3JSkWXJwqClE1dIxQM9', 'tomkxGQGz4b1kE0EM722', '94zOad0g7T7K4oa7zhDq', '15bJsujCI3tcDWeoZsQP', 'rBqbBncz61jpuaOTI1GW', 'vAxdfYVShGAQEwKYqDZR', 'MbMvLOFbicjtQwgx0j2r', 'tXgbXPnsMpKXkuTgvE3h', 'gxSxrhNNXvdHpOH0EHjV', 'ypIbR1aohyRSdDv25DPr', 'uDhfdG2VwEjWZ4JYzggn']),
    french: z.enum(['aQROLel5sQbj1vuIVi6B', 'GoEy5CmodqJy0T9AxjLk', 'txtf1EDouKke753vN8SL', 'qMfbtjrTDTlGtBy52G6E', 'b6nVfb3l2zshrLZTvqbs', 'TfGtrgcVrXWjJkeB51T1', 'TTtB1x9U8PF0Vgf20IAP', 'ohItIVrXTBI80RrUECOD', 'Qrl71rx6Yg8RvyPYRGCQ', 'JdwJ7jL68CWmQZuo7KgG', 'wufFsVwuYBePWKO6dMMN']),
    italian: z.enum(['sKbNSlHXq99bttvf8rRF', 'F9w7aaEjfT09qV89OdY8', 'ByVILX2H5wPAwDiNVKAR', '6ZseIH4NYfWg7mfPFOvh', 'W4UCcurKGuUzztgQ7JLv', 'eosUrtWReDe2UiCSc6pa', 'gfKKsLN1k0oYYN9n2dXX', 'fQmr8dTaOQq116mo2X7F', 'kAzI34nYjizE0zON6rXv', '3DPhHWXDY263XJ1d2EPN', '201hPjDVu4Q5DUV7tMQJ']),
  })
});

const InputStory = z.object({
  title: z.string(),
  description: z.string(),
  conversations: z.array(InputConversation),
});

const OutputConversation = z.object({
  name: z.string(),
  voiceIds: z.object({
    spanish: z.enum(['J3JSkWXJwqClE1dIxQM9', 'tomkxGQGz4b1kE0EM722', '94zOad0g7T7K4oa7zhDq', '15bJsujCI3tcDWeoZsQP', 'rBqbBncz61jpuaOTI1GW', 'vAxdfYVShGAQEwKYqDZR', 'MbMvLOFbicjtQwgx0j2r', 'tXgbXPnsMpKXkuTgvE3h', 'gxSxrhNNXvdHpOH0EHjV', 'ypIbR1aohyRSdDv25DPr', 'uDhfdG2VwEjWZ4JYzggn']),
    french: z.enum(['aQROLel5sQbj1vuIVi6B', 'GoEy5CmodqJy0T9AxjLk', 'txtf1EDouKke753vN8SL', 'qMfbtjrTDTlGtBy52G6E', 'b6nVfb3l2zshrLZTvqbs', 'TfGtrgcVrXWjJkeB51T1', 'TTtB1x9U8PF0Vgf20IAP', 'ohItIVrXTBI80RrUECOD', 'Qrl71rx6Yg8RvyPYRGCQ', 'JdwJ7jL68CWmQZuo7KgG', 'wufFsVwuYBePWKO6dMMN']),
    italian: z.enum(['sKbNSlHXq99bttvf8rRF', 'F9w7aaEjfT09qV89OdY8', 'ByVILX2H5wPAwDiNVKAR', '6ZseIH4NYfWg7mfPFOvh', 'W4UCcurKGuUzztgQ7JLv', 'eosUrtWReDe2UiCSc6pa', 'gfKKsLN1k0oYYN9n2dXX', 'fQmr8dTaOQq116mo2X7F', 'kAzI34nYjizE0zON6rXv', '3DPhHWXDY263XJ1d2EPN', '201hPjDVu4Q5DUV7tMQJ']),
  }),
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
          content: `You are a multilingual translation expert. Your task is to translate the provided English story into Spanish, French, and Italian without changing the story content in any way.

          For translations:
          - Provide accurate and natural translations (not literal translations)
          - Use proper punctuation and accents for each language
          - Make the translations natural and colloquial, not word-for-word
          - Preserve the meaning, tone, and style of the original English content
          
          For voice ids use the ids provided`
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