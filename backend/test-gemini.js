import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  console.log('🔍 Testing Gemini API...');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  
  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Gemini API is working!"' }
      ],
      temperature: 0.1,
      max_tokens: 20
    });

    console.log('✅ SUCCESS:', response.choices[0].message.content);
    console.log('🎉 Gemini is ready to use!');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.status === 429) {
      console.error('💰 Rate limit exceeded. Free tier: ~20 requests/day');
    } else if (error.status === 403) {
      console.error('🔑 Invalid API key');
    }
  }
}

testGemini();