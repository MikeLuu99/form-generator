'use server'

import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';
import { formFieldSchema } from './schema';

export async function generateFormResponse(prompt: string) {
  const { object } = await generateObject({
    model: anthropic('claude-3-5-haiku-latest'),
    schema: z.object({
      forms: z.array(formFieldSchema),
    }),
    system: 'You are given with creating the json schema base on the user prompt to generate a form, follow closely to the formFieldSchema. checked should always be true',
    prompt: prompt,
  });

  return object;
}