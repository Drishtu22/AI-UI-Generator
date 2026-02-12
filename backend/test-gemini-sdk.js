import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent("Say hello");

    console.log("✅ Success:");
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

test();
