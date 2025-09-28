import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // A more complex prompt to get all questions at once in a structured format
    const prompt = `
      You are an expert technical interviewer. Generate a set of interview questions for a Full-Stack developer (React/Node.js).
      Provide a response in a single, raw JSON object format.
      The JSON object must have three keys: "easy", "medium", and "hard".
      Each key should have an array of exactly two unique question strings.

      Example response format:
      {
        "easy": ["Question 1 text", "Question 2 text"],
        "medium": ["Question 3 text", "Question 4 text"],
        "hard": ["Question 5 text", "Question 6 text"]
      }

      Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response from the AI
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const generatedQuestions = JSON.parse(cleanedText);

    // Structure the questions for the frontend
    const questions = [
      { text: generatedQuestions.easy[0], difficulty: "Easy" },
      { text: generatedQuestions.easy[1], difficulty: "Easy" },
      { text: generatedQuestions.medium[0], difficulty: "Medium" },
      { text: generatedQuestions.medium[1], difficulty: "Medium" },
      { text: generatedQuestions.hard[0], difficulty: "Hard" },
      { text: generatedQuestions.hard[1], difficulty: "Hard" },
    ];

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Interview generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "The AI service failed to generate the interview. Please try again.",
      },
      { status: 503 }
    );
  }
}
