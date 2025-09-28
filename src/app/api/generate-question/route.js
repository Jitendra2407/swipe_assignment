
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with the API key from your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// *** FIX IS HERE: Use the recommended model name "gemini-pro" ***
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
  try {
    const { difficulty } = await req.json();

    // 1. Validate the difficulty level
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Invalid difficulty level provided." },
        { status: 400 }
      );
    }

    // 2. Check if the API key is configured on the server
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // 3. Construct a clear and concise prompt for the AI
    const prompt = `
      You are an expert technical interviewer. 
      Generate one technical interview question appropriate for a '${difficulty}' level full-stack developer specializing in React and Node.js.
      Important: Return ONLY the question text itself, without any introductory phrases like "Here is a question:" or any markdown formatting.
    `;

    // 4. Call the Gemini API to generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text().trim();

    // 5. Return the generated question
    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "The AI service is currently unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }
}