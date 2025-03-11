import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Character = z.object({
  name: z.string(),
  voiceIds: z.object({
    spanish: z.enum(['J3JSkWXJwqClE1dIxQM9', 'tomkxGQGz4b1kE0EM722', '94zOad0g7T7K4oa7zhDq', '15bJsujCI3tcDWeoZsQP', 'rBqbBncz61jpuaOTI1GW', 'vAxdfYVShGAQEwKYqDZR', 'MbMvLOFbicjtQwgx0j2r', 'tXgbXPnsMpKXkuTgvE3h', 'gxSxrhNNXvdHpOH0EHjV', 'ypIbR1aohyRSdDv25DPr', 'uDhfdG2VwEjWZ4JYzggn']),
    french: z.enum(['aQROLel5sQbj1vuIVi6B', 'GoEy5CmodqJy0T9AxjLk', 'txtf1EDouKke753vN8SL', 'qMfbtjrTDTlGtBy52G6E', 'b6nVfb3l2zshrLZTvqbs', 'TfGtrgcVrXWjJkeB51T1', 'TTtB1x9U8PF0Vgf20IAP', 'ohItIVrXTBI80RrUECOD', 'Qrl71rx6Yg8RvyPYRGCQ', 'JdwJ7jL68CWmQZuo7KgG', 'wufFsVwuYBePWKO6dMMN']),
    italian: z.enum(['sKbNSlHXq99bttvf8rRF', 'F9w7aaEjfT09qV89OdY8', 'ByVILX2H5wPAwDiNVKAR', '6ZseIH4NYfWg7mfPFOvh', 'W4UCcurKGuUzztgQ7JLv', 'eosUrtWReDe2UiCSc6pa', 'gfKKsLN1k0oYYN9n2dXX', 'fQmr8dTaOQq116mo2X7F', 'kAzI34nYjizE0zON6rXv', '3DPhHWXDY263XJ1d2EPN', '201hPjDVu4Q5DUV7tMQJ']),
  }),
});

const StoryOutline = z.object({
  title: z.string(),
  description: z.string(),
  exposition: z.string(),
  risingAction: z.string(),
  climax: z.string(),
  fallingAction: z.string(),
  resolution: z.string(),
  characters: z.array(Character),
});

const ModuleOutline = z.object({
  title: z.string(),
  description: z.string(),
  stories: z.array(StoryOutline),
  characters: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  exposition: z.string(),
  risingAction: z.string(),
  climax: z.string(),
  fallingAction: z.string(),
  resolution: z.string(),
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "system",
          content: `Generate the structure of a module by creating a list of 3-10 interconnected story concepts. A module should be thought of as a book, where the stories are the chapters. 
          Your job is to be a creative storyteller and provide the outline of the module which will then handed to a professional writer to be expanded into a full story.
          
          For the main module:
          - The module itself should be a collection of stories that are interconnected.
          - There should be a main protagonist that is the same across all stories.
          - Other recurring characters are allowed but not required.
          - characters should have a description that is a short summary of the character's role in the story, who they are, and their personality. Similar to a playwrite.
          - If a character is reoccuring, make sure to use the same voiceId for them across all stories.
          - The module should have an overarching exposition, rising action, climax, falling action, and resolution.
          - The module title should NOT be cheesy.
          - The module descirption will be seen by the reader and should be a short summary of the module without giving away too much.

          For each story:
          - The story should have subplots (and exposition, rising action, climax, falling action, and resolution) that are interconnected to the main plot.
          - Each story builds upon and connects to the previous story (except for first story)

          
          The voiceIds should be from the list of available voices below:
          
          Spanish:
          Narration: J3JSkWXJwqClE1dIxQM9
          Male: [tomkxGQGz4b1kE0EM722, 94zOad0g7T7K4oa7zhDq, 15bJsujCI3tcDWeoZsQP, rBqbBncz61jpuaOTI1GW, vAxdfYVShGAQEwKYqDZR]
          Female: [MbMvLOFbicjtQwgx0j2r, tXgbXPnsMpKXkuTgvE3h, gxSxrhNNXvdHpOH0EHjV, ypIbR1aohyRSdDv25DPr, uDhfdG2VwEjWZ4JYzggn]
          
          Italian:
          Narration: sKbNSlHXq99bttvf8rRF
          Male: [F9w7aaEjfT09qV89OdY8, ByVILX2H5wPAwDiNVKAR, 6ZseIH4NYfWg7mfPFOvh, W4UCcurKGuUzztgQ7JLv, eosUrtWReDe2UiCSc6pa]
          Female: [gfKKsLN1k0oYYN9n2dXX, fQmr8dTaOQq116mo2X7F, kAzI34nYjizE0zON6rXv, 3DPhHWXDY263XJ1d2EPN, 201hPjDVu4Q5DUV7tMQJ]

          French:
          Narration: aQROLel5sQbj1vuIVi6B
          Male: [TTtB1x9U8PF0Vgf20IAP, ohItIVrXTBI80RrUECOD, Qrl71rx6Yg8RvyPYRGCQ, JdwJ7jL68CWmQZuo7KgG, wufFsVwuYBePWKO6dMMN]
          Female: [GoEy5CmodqJy0T9AxjLk, txtf1EDouKke753vN8SL, qMfbtjrTDTlGtBy52G6E, b6nVfb3l2zshrLZTvqbs, TfGtrgcVrXWjJkeB51T1]
          `
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o",
      response_format: zodResponseFormat(ModuleOutline, "module")
    });

    const moduleOutline = completion.choices[0].message.parsed;
    return NextResponse.json(moduleOutline);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate module outline' },
      { status: 500 }
    );
  }
} 