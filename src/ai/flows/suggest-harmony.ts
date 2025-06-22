'use server';

/**
 * @fileOverview An AI agent that suggests chord progressions and harmonies for sacred music.
 *
 * - suggestHarmony - A function that suggests harmonies based on instrument and key.
 * - SuggestHarmonyInput - The input type for the suggestHarmony function.
 * - SuggestHarmonyOutput - The return type for the suggestHarmony function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHarmonyInputSchema = z.object({
  instrument: z.string().describe('The selected instrument (e.g., piano, organ, strings).'),
  key: z.string().describe('The musical key (e.g., C major, A minor).'),
});
export type SuggestHarmonyInput = z.infer<typeof SuggestHarmonyInputSchema>;

const SuggestHarmonyOutputSchema = z.object({
  chordProgression: z
    .string()
    .describe('A suggested chord progression that fits the selected instrument and key.'),
  harmonySuggestions: z
    .string()
    .describe('Harmony suggestions that complement the chord progression.'),
});
export type SuggestHarmonyOutput = z.infer<typeof SuggestHarmonyOutputSchema>;

export async function suggestHarmony(input: SuggestHarmonyInput): Promise<SuggestHarmonyOutput> {
  return suggestHarmonyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHarmonyPrompt',
  input: {schema: SuggestHarmonyInputSchema},
  output: {schema: SuggestHarmonyOutputSchema},
  prompt: `You are an expert in sacred music composition.

You are to suggest a chord progression and harmonies that fit the selected instrument and key.

Instrument: {{{instrument}}}
Key: {{{key}}}

Provide a chord progression suitable for sacred music in the given key and instrument, along with complementary harmony suggestions.`,
});

const suggestHarmonyFlow = ai.defineFlow(
  {
    name: 'suggestHarmonyFlow',
    inputSchema: SuggestHarmonyInputSchema,
    outputSchema: SuggestHarmonyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
