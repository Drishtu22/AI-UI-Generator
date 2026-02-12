import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const EXPLAINER_PROMPT = `You are a UI explainer. Explain the AI's decisions in clear, user-friendly English.

USER REQUEST: {userIntent}
UI PLAN: {plan}
PREVIOUS VERSION: {previousCode}
CHANGES MADE: {changes}
IS_MODIFICATION: {isModification}

Provide explanation in 3 short paragraphs maximum.
`;

export class Explainer {
  constructor() {
    console.log("📝 Explainer: Initializing with Groq");

    if (!process.env.GROQ_API_KEY) {
      throw new Error("❌ GROQ_API_KEY not found in .env");
    }

    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async explain(userIntent, plan, previousCode = null, changes = [], isModification = false) {
    try {
      const prompt = EXPLAINER_PROMPT
        .replace("{userIntent}", userIntent)
        .replace("{plan}", JSON.stringify(plan, null, 2))
        .replace("{previousCode}", previousCode || "None")
        .replace("{changes}", changes.join(", ") || "None")
        .replace("{isModification}", isModification ? "Yes" : "No");

      const response = await this.client.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("❌ Explainer error:", error);
      return this.fallbackExplanation(userIntent, plan, isModification);
    }
  }

  fallbackExplanation(userIntent, plan, isModification) {
    const action = isModification ? "modified" : "created";
    return `I ${action} a ${plan.layout} layout using ${plan.components.length} components to match your request.`;
  }
}
