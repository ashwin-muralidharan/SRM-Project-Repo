'use server';

/**
 * @fileOverview DOI Checker AI agent.
 *
 * - checkDuplicateDOI - A function that checks for duplicate DOI entries.
 * - CheckDuplicateDOIInput - The input type for the checkDuplicateDOI function.
 * - CheckDuplicateDOIOutput - The return type for the checkDuplicateDOI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDuplicateDOIInputSchema = z.object({
  doi: z.string().describe('The DOI to check for duplicates.'),
});
export type CheckDuplicateDOIInput = z.infer<typeof CheckDuplicateDOIInputSchema>;

const CheckDuplicateDOIOutputSchema = z.object({
  isDuplicate: z.boolean().describe('Whether the DOI is a duplicate or not.'),
});
export type CheckDuplicateDOIOutput = z.infer<typeof CheckDuplicateDOIOutputSchema>;

export async function checkDuplicateDOI(input: CheckDuplicateDOIInput): Promise<CheckDuplicateDOIOutput> {
  return checkDuplicateDOIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDuplicateDOIPrompt',
  input: {schema: CheckDuplicateDOIInputSchema},
  output: {schema: CheckDuplicateDOIOutputSchema},
  prompt: `You are an expert at identifying duplicate DOI entries in a research paper database.

  A faculty member has provided the following DOI for a new research paper:
  DOI: {{{doi}}}

  Determine if this DOI is already present in the database. If the DOI is found to be a duplicate, indicate 'true'. If it's unique, indicate 'false'.
  Return ONLY a JSON object with a single field called 'isDuplicate' that is either true or false.`,
});

const checkDuplicateDOIFlow = ai.defineFlow(
  {
    name: 'checkDuplicateDOIFlow',
    inputSchema: CheckDuplicateDOIInputSchema,
    outputSchema: CheckDuplicateDOIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
