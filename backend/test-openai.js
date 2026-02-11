import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

async function testOpenAI() {
  console.log('🔍 Testing OpenAI API Key...');
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);
  console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 7));
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ No API key found in .env file');
    return;
  }
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "API key is working!"' }],
      max_tokens: 20
    });
    
    console.log('✅ SUCCESS:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.status === 401) {
      console.error('🔑 Your API key is invalid or revoked');
    } else if (error.status === 429) {
      console.error('💰 You have exceeded your quota or have no billing setup');
    }
  }
}

testOpenAI();