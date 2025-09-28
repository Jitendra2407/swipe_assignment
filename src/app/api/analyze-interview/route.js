
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

export async function POST(req) {
  try {
    const { questions, answers } = await req.json();

    if (!questions || !answers || questions.length !== answers.length) {
      return NextResponse.json(
        { success: false, error: "Invalid interview data" },
        { status: 400 }
      );
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // Format the transcript for the AI
    const transcript = questions
      .map(
        (q, i) =>
          `Question ${i + 1} (${q.difficulty}): ${q.text}\nAnswer ${i + 1}: ${
            answers[i] || "No answer provided."
          }\n`
      )
      .join("\n");

    // Construct the prompt for the AI
    const prompt = `
      You are an expert technical interviewer for a Full-Stack developer position specializing in React and Node.js.
      Your task is to analyze the following interview transcript.

      Transcript:
      ---
      ${transcript}
      ---

      Based on the transcript, please provide the following in a raw JSON format:
      1. A "score" out of 100. Be critical. A perfect score should be rare. Consider the difficulty of the question and the quality of the answer. A non-answer should receive a very low score for that question.
      2. A "summary" (a string of 2-3 sentences) of the candidate's performance, highlighting their strengths and areas for improvement.

      Your response MUST be a valid JSON object with ONLY the keys "score" and "summary". For example:
      {
        "score": 82,
        "summary": "The candidate demonstrates a strong grasp of fundamental React concepts but could improve their understanding of advanced Node.js topics. Their problem-solving approach is logical, but they seemed to struggle under the time constraints of the harder questions."
      }
    `;

    // Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse the JSON response from the AI
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, ...analysis });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze interview" },
      { status: 500 }
    );
  }
}