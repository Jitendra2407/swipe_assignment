"use client";
import { useState, useEffect, useCallback } from "react";
import useCandidateStore from "../store/candidateStore";
import Timer from "./Timer";

const INTERVIEW_FLOW = [
  { difficulty: "Easy", duration: 20 },
  { difficulty: "Easy", duration: 20 },
  { difficulty: "Medium", duration: 60 },
  { difficulty: "Medium", duration: 60 },
  { difficulty: "Hard", duration: 120 },
  { difficulty: "Hard", duration: 120 },
];

const InterviewView = () => {
  const {
    currentCandidate,
    startInterview,
    setInterviewQuestions,
    submitAnswer,
    endInterview,
    setFinalAnalysisAndArchive, // Use the updated action
    clearData, // Import clearData to reset the session
  } = useCandidateStore();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { interview } = currentCandidate;
  const { status, questions, answers, currentQuestionIndex, score, summary } =
    interview;

  const handleStartInterview = useCallback(async () => {
    startInterview();
    try {
      const response = await fetch("/api/generate-interview", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setInterviewQuestions(data.questions);
      } else {
        console.error("Failed to generate interview:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch interview:", error);
    }
  }, [startInterview, setInterviewQuestions]);

  useEffect(() => {
    const analyzeResults = async () => {
      // Check if status is 'completed' and score is still the default 0
      if (status === "completed" && score === 0) {
        setIsAnalyzing(true);
        try {
          const response = await fetch("/api/analyze-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions, answers }),
          });
          const result = await response.json();
          if (result.success) {
            setFinalAnalysisAndArchive(result.score, result.summary);
          }
        } catch (error) {
          console.error("Failed to analyze results:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    analyzeResults();
  }, [status, questions, answers, score, setFinalAnalysisAndArchive]);

  useEffect(() => {
    if (
      status === "in-progress" &&
      currentQuestionIndex >= INTERVIEW_FLOW.length
    ) {
      endInterview();
    }
  }, [status, currentQuestionIndex, endInterview]);

  const handleAnswerSubmit = (isTimeout = false) => {
    const answerToSubmit =
      isTimeout && currentAnswer === "" ? "No answer provided" : currentAnswer;
    submitAnswer(answerToSubmit);
    setCurrentAnswer("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAnswerSubmit();
  };

  const currentFlowStep = INTERVIEW_FLOW[currentQuestionIndex];
  const currentQuestion = questions[currentQuestionIndex];

  if (status === "idle") {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Ready to start your interview?
        </h2>
        <button
          onClick={handleStartInterview}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Start Interview
        </button>
      </div>
    );
  }

  if (status === "preparing") {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-semibold animate-pulse">
          Preparing your interview questions...
        </p>
      </div>
    );
  }

  if (status === "completed") {
    if (isAnalyzing || score === 0) {
      return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse text-2xl font-bold text-gray-700">
            Analyzing your results...
          </div>
          <p className="mt-2 text-gray-500">
            The AI is reviewing your answers to generate a score and summary.
          </p>
        </div>
      );
    }
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Interview Completed!
        </h2>
        <div className="mb-6">
          <p className="text-lg text-gray-700">Your Final Score:</p>
          <p className="text-6xl font-extrabold text-blue-600 my-2">
            {score}/100
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            AI Performance Summary:
          </h3>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">{summary}</p>
        </div>
        {/* *** FIX IS HERE: Add button to start a new session *** */}
        <button
          onClick={clearData}
          className="mt-8 px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      {currentQuestion ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentQuestion.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : currentQuestion.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {currentQuestion.difficulty} Question {currentQuestionIndex + 1}
                /{INTERVIEW_FLOW.length}
              </span>
              <p className="mt-4 text-lg text-gray-800">
                {currentQuestion.text}
              </p>
            </div>
            <Timer
              key={currentQuestionIndex}
              duration={currentFlowStep.duration}
              onTimeout={() => handleAnswerSubmit(true)}
              questionIndex={currentQuestionIndex}
            />
          </div>
          <form onSubmit={handleFormSubmit}>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Submit Answer
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center p-10">Loading question...</div>
      )}
    </div>
  );
};

export default InterviewView;


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import useCandidateStore from "../store/candidateStore";
// import Timer from "./Timer";

// const INTERVIEW_FLOW = [
//   { difficulty: "Easy", duration: 20 },
//   { difficulty: "Easy", duration: 20 },
//   { difficulty: "Medium", duration: 60 },
//   { difficulty: "Medium", duration: 60 },
//   { difficulty: "Hard", duration: 120 },
//   { difficulty: "Hard", duration: 120 },
// ];

// const InterviewView = () => {
//   const {
//     currentCandidate,
//     startInterview,
//     setInterviewQuestions,
//     submitAnswer,
//     endInterview,
//     finalizeAndArchiveInterview,
//     clearData,
//   } = useCandidateStore();

//   const [currentAnswer, setCurrentAnswer] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   // *** FIX IS HERE: Use local state to display the final results ***
//   const [finalResult, setFinalResult] = useState(null);

//   const { interview } = currentCandidate;
//   const { status, questions, answers, currentQuestionIndex } = interview;

//   const handleStartInterview = useCallback(async () => {
//     startInterview();
//     try {
//       const response = await fetch("/api/generate-interview", {
//         method: "POST",
//       });
//       const data = await response.json();
//       if (data.success) {
//         setInterviewQuestions(data.questions);
//       } else {
//         console.error("Failed to generate interview:", data.error);
//       }
//     } catch (error) {
//       console.error("Failed to fetch interview:", error);
//     }
//   }, [startInterview, setInterviewQuestions]);

//   useEffect(() => {
//     const analyzeResults = async () => {
//       if (status === "completed" && !finalResult) {
//         setIsAnalyzing(true);
//         try {
//           const response = await fetch("/api/analyze-interview", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ questions, answers }),
//           });
//           const result = await response.json();
//           if (result.success) {
//             // Set local state to display results immediately
//             setFinalResult({ score: result.score, summary: result.summary });

//             // Use a timeout to archive and reset after the user sees their score
//             setTimeout(() => {
//               finalizeAndArchiveInterview(result.score, result.summary);
//             }, 5000); // Wait 5 seconds
//           }
//         } catch (error) {
//           console.error("Failed to analyze results:", error);
//         } finally {
//           setIsAnalyzing(false);
//         }
//       }
//     };
//     analyzeResults();
//   }, [status, questions, answers, finalResult, finalizeAndArchiveInterview]);

//   useEffect(() => {
//     if (
//       status === "in-progress" &&
//       currentQuestionIndex >= INTERVIEW_FLOW.length
//     ) {
//       endInterview();
//     }
//   }, [status, currentQuestionIndex, endInterview]);

//   const handleAnswerSubmit = (isTimeout = false) => {
//     const answerToSubmit =
//       isTimeout && currentAnswer === "" ? "No answer provided" : currentAnswer;
//     submitAnswer(answerToSubmit);
//     setCurrentAnswer("");
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     handleAnswerSubmit();
//   };

//   const currentFlowStep = INTERVIEW_FLOW[currentQuestionIndex];
//   const currentQuestion = questions[currentQuestionIndex];

//   if (status === "idle") {
//     return (
//       <div className="text-center p-8 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-4">
//           Ready to start your interview?
//         </h2>
//         <button
//           onClick={handleStartInterview}
//           className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//         >
//           Start Interview
//         </button>
//       </div>
//     );
//   }

//   if (status === "preparing") {
//     return (
//       <div className="text-center p-10 bg-white rounded-lg shadow-md">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600 font-semibold animate-pulse">
//           Preparing your interview questions...
//         </p>
//       </div>
//     );
//   }

//   if (status === "completed") {
//     if (isAnalyzing || !finalResult) {
//       return (
//         <div className="text-center p-8 bg-white rounded-lg shadow-md">
//           <div className="animate-pulse text-2xl font-bold text-gray-700">
//             Analyzing your results...
//           </div>
//           <p className="mt-2 text-gray-500">
//             The AI is reviewing your answers to generate a score and summary.
//           </p>
//         </div>
//       );
//     }
//     return (
//       <div className="text-center p-8 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-green-600 mb-4">
//           Interview Completed!
//         </h2>
//         <div className="mb-6">
//           <p className="text-lg text-gray-700">Your Final Score:</p>
//           <p className="text-6xl font-extrabold text-blue-600 my-2">
//             {finalResult.score}/100
//           </p>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">
//             AI Performance Summary:
//           </h3>
//           <p className="mt-2 text-gray-600 max-w-xl mx-auto">
//             {finalResult.summary}
//           </p>
//         </div>
//         <p className="mt-6 text-sm text-gray-400 animate-pulse">
//           This page will reset for the next candidate in a few seconds...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-xl">
//       {currentQuestion ? (
//         <>
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <span
//                 className={`px-3 py-1 text-sm font-medium rounded-full ${
//                   currentQuestion.difficulty === "Easy"
//                     ? "bg-green-100 text-green-800"
//                     : currentQuestion.difficulty === "Medium"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 {currentQuestion.difficulty} Question {currentQuestionIndex + 1}
//                 /{INTERVIEW_FLOW.length}
//               </span>
//               <p className="mt-4 text-lg text-gray-800">
//                 {currentQuestion.text}
//               </p>
//             </div>
//             <Timer
//               key={currentQuestionIndex}
//               duration={currentFlowStep.duration}
//               onTimeout={() => handleAnswerSubmit(true)}
//               questionIndex={currentQuestionIndex}
//             />
//           </div>
//           <form onSubmit={handleFormSubmit}>
//             <textarea
//               value={currentAnswer}
//               onChange={(e) => setCurrentAnswer(e.target.value)}
//               placeholder="Your answer..."
//               className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="text-right mt-4">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//               >
//                 Submit Answer
//               </button>
//             </div>
//           </form>
//         </>
//       ) : (
//         <div className="text-center p-10">Loading question...</div>
//       )}
//     </div>
//   );
// };

// export default InterviewView;