import { NextResponse } from "next/server";

// This is a placeholder for a real AI API call.
// Replace this function with a call to a service like OpenAI or Gemini.
const getMockAIAnalysis = (transcript) => {
  // Simulate a delay to mimic a real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * (95 - 65 + 1) + 65); // Random score between 65 and 95
      let summary =
        "The candidate showed a solid understanding of fundamental concepts. ";

      if (score > 90) {
        summary +=
          "They provided detailed and accurate answers, especially on the harder questions, demonstrating deep expertise.";
      } else if (score > 75) {
        summary +=
          "Performance was strong on easy and medium questions, but there was some hesitation on the more complex topics. Overall, a strong performance.";
      } else {
        summary +=
          "While the candidate has a good grasp of the basics, they struggled with the medium and hard questions. Further study on advanced topics is recommended.";
      }

      resolve({ score, summary });
    }, 2500); // 2.5 second delay
  });
};

export async function POST(req) {
  try {
    const { questions, answers } = await req.json();

    if (!questions || !answers || questions.length !== answers.length) {
      return NextResponse.json(
        { success: false, error: "Invalid interview data" },
        { status: 400 }
      );
    }

    // Format the transcript for the AI
    const transcript = questions
      .map(
        (q, i) =>
          `Question ${i + 1} (${q.difficulty}): ${q.text}\nAnswer ${i + 1}: ${
            answers[i]
          }\n`
      )
      .join("\n");

    // --- REAL AI API CALL WOULD GO HERE ---
    // Example using OpenAI's SDK (you would need to install and configure it)
    /*
    const prompt = `
      You are an expert technical interviewer for a Full-Stack (React/Node.js) developer position. 
      Analyze the following interview transcript and provide a final score out of 100 and a brief summary of the candidate's performance.
      
      Transcript:
      ${transcript}

      Provide your response in a JSON format with two keys: "score" (a number) and "summary" (a string of 2-3 sentences).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    */
    // --- END OF REAL AI CALL EXAMPLE ---

    // Using the mock function for now
    const analysis = await getMockAIAnalysis(transcript);

    return NextResponse.json({ success: true, ...analysis });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze interview" },
      { status: 500 }
    );
  }
}
