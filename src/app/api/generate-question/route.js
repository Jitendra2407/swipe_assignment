// // app/api/generate-question/route.js
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // // Initialize Gemini client
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // Initialize Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Use the latest supported model
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// // Map difficulty to prompt
// const prompts = {
//   Easy: `Generate a beginner-level technical interview question for a full-stack React/Node.js developer. 
//         Focus on basic JavaScript, React hooks, or Node.js concepts.
//         Return only the question, no additional text.`,

//   Medium: `Generate an intermediate-level technical interview question for a full-stack React/Node.js developer.
//            Focus on state management, API design, performance, or architectural decisions.
//            Return only the question, no additional text.`,

//   Hard: `Generate an advanced technical interview question for a senior full-stack React/Node.js developer.
//          Focus on complex scenarios, optimization, security, scalability, or advanced patterns.
//          Return only the question, no additional text.`,
// };

// // Helper function to generate a question
// async function generateAIQuestion(difficulty) {
//   try {
//     const fullPrompt = `You are an expert technical interviewer. ${prompts[difficulty]}`;
//     const result = await model.generateContent(fullPrompt);
//     const response = result.response;
//     const text = response.text();

//     return text.trim();
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw new Error("Failed to generate question");
//   }
// }

// // API POST route
// export async function POST(req) {
//   try {
//     const { difficulty } = await req.json();

//     // Validate difficulty
//     if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid difficulty level. Must be 'Easy', 'Medium', or 'Hard'." },
//         { status: 400 }
//       );
//     }

//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
//     }

//     // Generate question
//     const question = await generateAIQuestion(difficulty);

//     return NextResponse.json({ success: true, question });
//   } catch (error) {
//     console.error("Question generation error:", error);
//     return NextResponse.json(
//       { success: false, error: "AI service temporarily unavailable. Please try again." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

// This is a placeholder for a real AI API call (e.g., OpenAI, Gemini)
// In a real application, you would replace this with a call to your chosen AI service.
const getMockAIQuestion = (difficulty) => {
  const questions = {
    Easy: [
      "What is the difference between `let`, `const`, and `var` in JavaScript?",
      "Explain the concept of component state in React.",
      "What is the purpose of the `useEffect` hook in React?",
    ],
    Medium: [
      "Describe the event loop in Node.js.",
      "What are middlewares in Express.js and how do they work?",
      "How do you handle state management in a large React application?",
    ],
    Hard: [
      "Explain the concept of server-side rendering (SSR) and its benefits.",
      "What are some common security vulnerabilities in a Node.js application?",
      "Describe how you would optimize a slow-running React component.",
    ],
  };
  const randomIndex = Math.floor(Math.random() * questions[difficulty].length);
  return questions[difficulty][randomIndex];
};

export async function POST(req) {
  try {
    const { difficulty } = await req.json();

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    // In a real application, you would make an API call to your AI service here.
    // For example:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: `Generate a ${difficulty} interview question for a full-stack React/Node.js developer.` }],
    // });
    // const question = response.choices[0].message.content;

    const question = getMockAIQuestion(difficulty);

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate question" },
      { status: 500 }
    );
  }
}