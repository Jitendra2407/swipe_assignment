"use client";
import React from "react";
import { useParams } from "next/navigation";
import useCandidateStore from "../../../store/candidateStore";
import Link from "next/link";

const CandidateDetailPage = () => {
  const { id } = useParams();
  const allCandidates = useCandidateStore((state) => state.allCandidates);
  const candidate = allCandidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-16 text-center">
            {/* Error Icon */}
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-800">
                Candidate Not Found
              </h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                The candidate you're looking for doesn't exist or the data is
                still loading.
              </p>

              <Link
                href="/interviewer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { candidateData, interview } = candidate;
  const interviewDate = new Date(candidate.id);

  // Calculate performance level
  const getPerformanceLevel = (score) => {
    if (score >= 85) return { level: "Excellent", color: "green", icon: "🏆" };
    if (score >= 70) return { level: "Good", color: "blue", icon: "👍" };
    return { level: "Needs Improvement", color: "red", icon: "💪" };
  };

  const performance = getPerformanceLevel(interview.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8 slide-up">
          <Link
            href="/interviewer"
            className="group inline-flex items-center space-x-3 px-6 py-3 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 font-semibold rounded-2xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12 scale-in">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/25 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {candidateData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <h1 className="text-4xl font-black">{candidateData.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{candidateData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{candidateData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Date & Status */}
              <div className="text-right space-y-3">
                <div className="text-blue-100">
                  <div className="text-sm opacity-75">Interview Date</div>
                  <div className="font-semibold">
                    {interviewDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm opacity-75">
                    {interviewDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Score & Analysis */}
          <div className="xl:col-span-1 space-y-6 fade-in">
            {/* Score Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-8 text-center">
              <div className="space-y-6">
                {/* Performance Icon */}
                <div className="text-6xl">{performance.icon}</div>

                {/* Score */}
                <div className="space-y-2">
                  <div className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {interview.score}
                  </div>
                  <div className="text-2xl font-bold text-gray-500">
                    out of 100
                  </div>
                </div>

                {/* Performance Level Badge */}
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold border-2 ${
                    performance.color === "green"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : performance.color === "blue"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {performance.level}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    AI Analysis
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {interview.summary}
                </p>
              </div>
            </div>

            {/* Interview Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Interview Overview</span>
                </h2>

                <div className="space-y-4">
                  <StatItem
                    label="Total Questions"
                    value={interview.questions.length}
                    icon="📝"
                  />
                  <StatItem
                    label="Questions Answered"
                    value={
                      interview.answers.filter(
                        (a) =>
                          a && a.trim() !== "" && a !== "No answer provided"
                      ).length
                    }
                    icon="✅"
                  />
                  <StatItem
                    label="Completion Rate"
                    value={`${Math.round(
                      (interview.answers.filter(
                        (a) =>
                          a && a.trim() !== "" && a !== "No answer provided"
                      ).length /
                        interview.questions.length) *
                        100
                    )}%`}
                    icon="📊"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Q&A Transcript */}
          <div className="xl:col-span-2 scale-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Interview Transcript
                  </h2>
                </div>
              </div>

              {/* Q&A Content */}
              <div className="p-8 space-y-8 max-h-[800px] overflow-y-auto custom-scrollbar">
                {interview.questions.map((question, index) => (
                  <div key={index} className="group">
                    {/* Question */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            Q{index + 1}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full ${
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : question.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                        <p className="text-gray-800 font-medium text-lg leading-relaxed">
                          {question.text}
                        </p>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="ml-12 mb-8">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          A
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          Candidate Response
                        </span>
                      </div>
                      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {interview.answers[index] || (
                            <span className="text-red-500 italic">
                              No answer provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    {index < interview.questions.length - 1 && (
                      <div className="border-t border-gray-200/50 my-8"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for stats
const StatItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50">
    <div className="flex items-center space-x-3">
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

export default CandidateDetailPage;