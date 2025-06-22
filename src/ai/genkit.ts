import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Read the API key from environment variables
const googleApiKey = process.env.GOOGLE_API_KEY;

export const ai = genkit({
  // Configure the googleAI plugin with the API key
  plugins: [googleAI({ apiKey: googleApiKey })],
  model: 'googleai/gemini-2.0-flash',
});
