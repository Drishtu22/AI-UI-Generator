import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ComponentValidator } from "../validation/ComponentValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const PLANNER_PROMPT = `
You are a strict UI planning agent.

You MUST ONLY use the following components:
Navbar, Card, Button, Input, Table, Chart, Modal

Do NOT invent new components.
Do NOT output JSX.
Do NOT explain anything.
Output ONLY valid JSON.

USER REQUEST:
{userIntent}

PREVIOUS UI PLAN:
{previousContext}

Output JSON format:
{
  "layout": "single | split | grid",
  "components": [
    {
      "type": "ComponentName",
      "props": {},
      "children": []
    }
  ],
  "composition": "short description"
}
`;

export class Planner {
  constructor() {
    console.log("🧠 Planner: Using Groq");

    if (!process.env.GROQ_API_KEY) {
      throw new Error("❌ GROQ_API_KEY not set");
    }

    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    this.validator = new ComponentValidator();
  }

  async plan(userIntent, previousPlan = null) {
    try {
      const prompt = PLANNER_PROMPT
        .replace("{userIntent}", userIntent)
        .replace("{previousContext}", previousPlan ? JSON.stringify(previousPlan) : "None");

      const response = await this.client.chat.completions.create({
       model: "llama-3.3-70b-versatile",

        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      });

      let text = response.choices[0].message.content;

      const cleanText = text.replace(/```json|```/g, "").trim();
      const plan = JSON.parse(cleanText);

      this.validatePlan(plan);

      return plan;
    } catch (error) {
      console.error("❌ Groq error:", error);
      return this.deterministicPlan(userIntent, previousPlan);
    }
  }

  validatePlan(plan) {
    if (!plan.layout || !Array.isArray(plan.components)) {
      throw new Error("Invalid plan structure");
    }
  }

  deterministicPlan(userIntent) {
    return {
      layout: "single",
      components: [
        {
          type: "Card",
          props: { title: "Fallback UI" },
          children: [],
        },
      ],
      composition: "Fallback layout",
    };
  }
}
