import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const EXPLAINER_PROMPT = `You are a UI explainer. Explain the AI's decisions in clear, user-friendly English.

USER REQUEST: {userIntent}
UI PLAN: {plan}
PREVIOUS VERSION: {previousCode}
CHANGES MADE: {changes}
IS_MODIFICATION: {isModification}

Provide a clear explanation with these sections:

1. LAYOUT CHOICE: Why this layout structure was selected
2. COMPONENT SELECTION: For each component used, explain why it's the right choice
3. MODIFICATIONS: What changed from the previous version (if applicable)
4. TRADE-OFFS: What considerations were made

Keep explanations concise - 3 paragraphs maximum.`;

export class Explainer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
  }

  async explain(userIntent, plan, previousCode = null, changes = [], isModification = false) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          {
            role: 'system',
            content: EXPLAINER_PROMPT
              .replace('{userIntent}', userIntent)
              .replace('{plan}', JSON.stringify(plan, null, 2))
              .replace('{previousCode}', previousCode ? previousCode.substring(0, 200) + '...' : 'None')
              .replace('{changes}', changes.length ? changes.join(', ') : 'No changes')
              .replace('{isModification}', isModification ? 'Yes' : 'No')
          }
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content || this.fallbackExplanation(userIntent, plan);
      
    } catch (error) {
      console.error('Explainer error:', error);
      return this.fallbackExplanation(userIntent, plan);
    }
  }

  fallbackExplanation(userIntent, plan) {
    return `Based on your request "${userIntent.substring(0, 50)}...", I created a UI with a ${plan.layout} layout using ${plan.components.length} components: ${plan.components.map(c => c.type).join(', ')}. This structure provides a clean, intuitive interface that matches your requirements.`;
  }
}