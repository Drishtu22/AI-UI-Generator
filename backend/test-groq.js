import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [{ role: "user", content: "Say hello" }],
    });

    console.log("✅ Success:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

test();
