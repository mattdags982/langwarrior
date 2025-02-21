import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const StoryOutline = z.object({
  title: z.string(),
  description: z.string(),
});

const ModuleOutline = z.object({
  title: z.string(),
  description: z.string(),
  stories: z.array(StoryOutline),
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "system",
          content: `Generate the structure of a module by creating a list of 3-5 interconnected story concepts. For each story concept, provide:
          - A high-level description of the story's plot and main events
          - How this story builds upon and connects to the previous story (except for first story)
          - How this story sets up and connects to the next story (except for last story)
          - The key themes and learning objectives for language learners
          
          The module as a whole should:
          - Have a clear overarching theme or learning objective that ties the stories together
          - Show logical progression and increasing complexity across the stories
          - Be engaging and culturally relevant for language learners
          - Maintain appropriate difficulty level throughout
          
          Each story concept should give enough detail about the plot and connections that it could be expanded into a full story later.`
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