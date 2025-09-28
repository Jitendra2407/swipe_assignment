"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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
    setFinalAnalysisAndArchive,
    clearData,
  } = useCandidateStore();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // *** FIX: Use refs to prevent duplicate API calls ***
  const analysisStartedRef = useRef(false);
  const analysisCompletedRef = useRef(false);

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

  // *** FIX: Prevent duplicate analysis calls ***
  useEffect(() => {
    const analyzeResults = async () => {
      // Check if analysis should run and hasn't been started yet
      if (
        status === "completed" &&
        score === 0 &&
        !analysisStartedRef.current &&
        !analysisCompletedRef.current &&
        questions.length > 0 &&
        answers.length > 0
      ) {
        analysisStartedRef.current = true;
        setIsAnalyzing(true);

        try {
          console.log("Starting interview analysis...");
          const response = await fetch("/api/analyze-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions, answers }),
          });

          const result = await response.json();

          if (result.success) {
            console.log("Analysis completed:", result);
            setFinalAnalysisAndArchive(result.score, result.summary);
            analysisCompletedRef.current = true;
          } else {
            console.error("Analysis failed:", result.error);
            // Reset flags on failure so user can retry
            analysisStartedRef.current = false;
          }
        } catch (error) {
          console.error("Failed to analyze results:", error);
          // Reset flags on error so user can retry
          analysisStartedRef.current = false;
        } finally {
          setIsAnalyzing(false);
        }
      }
    };

    analyzeResults();
  }, [status, questions, answers, score, setFinalAnalysisAndArchive]);

  // Reset analysis flags when starting a new interview
  useEffect(() => {
    if (status === "preparing" || status === "idle") {
      analysisStartedRef.current = false;
      analysisCompletedRef.current = false;
    }
  }, [status]);

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

  // Progress calculation
  const progress = (currentQuestionIndex / INTERVIEW_FLOW.length) * 100;

  if (status === "idle") {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden">
        <div className="p-12 text-center space-y-8">
          {/* Start Interview Icon */}
          <div className="inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 group">
              <svg
                className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Ready to Begin?
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Your AI interview is about to start. Take a deep breath and show
              your best self!
            </p>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
              <h3 className="font-semibold text-blue-800 mb-3">
                💡 Quick Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-2 text-left">
                <li>• Write clearly and concisely</li>
                <li>• Take your time to think before answering</li>
                <li>• Stay calm and be yourself</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            className="group px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <span>Start Interview</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (status === "preparing") {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-16 text-center">
        <div className="space-y-8">
          {/* Animated Loading */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div
              className="absolute inset-4 border-2 border-indigo-400 rounded-full border-b-transparent animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Preparing Your Interview
            </h2>
            <p className="text-gray-600 text-lg">
              AI is crafting personalized questions just for you...
            </p>

            {/* Loading Steps */}
            <div className="flex justify-center space-x-8 mt-8">
              <LoadingStep label="Analyzing Profile" completed />
              <LoadingStep label="Generating Questions" active />
              <LoadingStep label="Calibrating Difficulty" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    // *** FIX: Show analysis state while score is being calculated ***
    if (isAnalyzing || (score === 0 && !analysisCompletedRef.current)) {
      return (
        <div className="bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-16 text-center">
          <div className="space-y-8">
            {/* Analysis Animation */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-2 border-3 border-purple-400 rounded-full border-r-transparent animate-spin"></div>
              <div
                className="absolute inset-6 border-2 border-indigo-600 rounded-full border-l-transparent animate-spin"
                style={{ animationDirection: "reverse" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-purple-600 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Analyzing Your Performance
              </h2>
              <p className="text-gray-600 text-lg">
                AI is carefully reviewing your responses to provide detailed
                feedback
              </p>
            </div>
          </div>
        </div>
      );
    }

    // *** FIX: Show results only when analysis is complete and score > 0 ***
    if (score > 0 || analysisCompletedRef.current) {
      return (
        <div className="bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-12 text-center space-y-8">
            {/* Success Animation */}
            <div className="inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-bounce">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-green-600 mb-4">
                Interview Complete!
              </h2>

              {/* Score Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
                <p className="text-2xl font-semibold text-gray-700 mb-4">
                  Your Final Score
                </p>
                <div className="text-8xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {score}
                </div>
                <p className="text-3xl font-bold text-gray-500">out of 100</p>

                {/* Score Badge */}
                <div className="mt-6">
                  <span
                    className={`px-6 py-3 rounded-full text-lg font-bold ${
                      score >= 85
                        ? "bg-green-100 text-green-800 border-2 border-green-200"
                        : score >= 70
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
                        : "bg-red-100 text-red-800 border-2 border-red-200"
                    }`}
                  >
                    {score >= 85
                      ? "🏆 Excellent"
                      : score >= 70
                      ? "👍 Good"
                      : "💪 Keep Improving"}
                  </span>
                </div>
              </div>

              {/* AI Summary */}
              {summary && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200/50 text-left">
                  <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center">
                    🤖 AI Performance Analysis
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {summary}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={clearData}
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      );
    }

    // Fallback for edge cases
    return (
      <div className="bg-gradient-to-br from-white via-yellow-50/50 to-orange-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-16 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Processing Complete
          </h2>
          <p className="text-gray-600">
            Interview analysis is being finalized...
          </p>
          <button
            onClick={clearData}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  // Active Interview
  return (
    <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8">
        {currentQuestion ? (
          <div className="space-y-8">
            {/* Question Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Question Meta */}
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${
                      currentQuestion.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : currentQuestion.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {currentQuestion.difficulty} Question
                  </span>
                  <span className="text-gray-500 font-medium">
                    {currentQuestionIndex + 1} of {INTERVIEW_FLOW.length}
                  </span>
                </div>

                {/* Question Text */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <p className="text-xl font-medium text-gray-800 leading-relaxed">
                    {currentQuestion.text}
                  </p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex-shrink-0 flex justify-center lg:justify-end">
                <Timer
                  key={currentQuestionIndex}
                  duration={currentFlowStep.duration}
                  onTimeout={() => handleAnswerSubmit(true)}
                  questionIndex={currentQuestionIndex}
                />
              </div>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Answer
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-48 p-6 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none text-gray-800 placeholder-gray-500 resize-none transition-all duration-300 text-lg leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                >
                  <span>Submit Answer</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center p-12">
            <div className="animate-pulse text-2xl font-bold text-gray-700">
              Loading next question...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Step Component
const LoadingStep = ({ label, completed, active }) => (
  <div className="flex flex-col items-center space-y-2">
    <div
      className={`w-4 h-4 rounded-full border-2 ${
        completed
          ? "bg-green-500 border-green-500"
          : active
          ? "border-blue-500 animate-pulse"
          : "border-gray-300"
      }`}
    >
      {completed && (
        <svg
          className="w-2 h-2 text-white m-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
    <span
      className={`text-xs font-medium ${
        completed
          ? "text-green-600"
          : active
          ? "text-blue-600"
          : "text-gray-500"
      }`}
    >
      {label}
    </span>
  </div>
);

export default InterviewView;