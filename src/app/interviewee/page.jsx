"use client";
import { useState, useEffect, useRef } from "react";
import useCandidateStore from "../../store/candidateStore";
import FileUpload from "../../components/FileUpolad";
import CandidateInfo from "../../components/CandidateInfo";
import Chat from "../../components/Chat";
import InterviewView from "../../components/InterviewView";
import WelcomeBackModal from "../../components/WelcomeBackModal";

export default function IntervieweePage() {
  const { currentCandidate, clearData } = useCandidateStore();
  const { candidateData, interview } = currentCandidate;

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const initialCheckPerformed = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (
      isClient &&
      !initialCheckPerformed.current &&
      interview?.status === "in-progress"
    ) {
      setShowWelcomeBackModal(true);
    }
    if (isClient) {
      initialCheckPerformed.current = true;
    }
  }, [isClient, interview?.status]);

  useEffect(() => {
    if (candidateData) {
      const { name, email, phone } = candidateData;
      setIsProfileComplete(!!(name && email && phone));
    } else {
      setIsProfileComplete(false);
    }
  }, [candidateData]);

  const hasUploadedResume = !!candidateData?.rawText;

  const handleResume = () => {
    setShowWelcomeBackModal(false);
  };

  const handleStartOver = () => {
    clearData();
    setShowWelcomeBackModal(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <WelcomeBackModal
        isOpen={showWelcomeBackModal}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />

      {/* Main Container with improved spacing and modern background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Welcome Section - Only show when no resume uploaded */}
            {!hasUploadedResume && (
              <div className="text-center space-y-8 slide-up">
                {/* Hero Section */}
                <div className="space-y-6">
                  <div className="inline-block">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-6 mx-auto">
                      <svg
                        className="w-10 h-10 text-white"
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
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                      AI Interview
                      <br />
                      <span className="text-4xl md:text-5xl">Assistant</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Experience the future of interviews with our intelligent
                      AI system
                    </p>

                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                      Upload your resume and let our AI extract your information
                      to create a personalized interview experience
                    </p>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                  <FeatureCard
                    icon={
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    }
                    title="Smart Resume Analysis"
                    description="AI automatically extracts your personal information from any PDF or DOCX resume"
                  />
                  <FeatureCard
                    icon={
                      <svg
                        className="w-6 h-6"
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
                    }
                    title="Interactive Chat"
                    description="Conversational AI helps complete any missing information from your profile"
                  />
                  <FeatureCard
                    icon={
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    title="Timed Interview"
                    description="6 carefully crafted questions with varying difficulty levels and time limits"
                  />
                </div>
              </div>
            )}

            {/* Upload & Profile Section */}
            {!isProfileComplete && (
              <div className="scale-in">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-white/50">
                  {!hasUploadedResume ? (
                    <div className="text-center space-y-8">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-gray-800">
                          Let's Get Started
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Upload your resume to begin the AI-powered interview
                          process
                        </p>
                      </div>
                      <FileUpload />
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-gray-800">
                          Review Your Information
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Please verify the extracted information and provide
                          any missing details
                        </p>
                      </div>
                      <CandidateInfo />
                      {!isProfileComplete && <Chat />}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interview Section */}
            {isProfileComplete && (
              <div className="fade-in">
                <div className="text-center mb-12 space-y-6">
                  <div className="inline-block">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25 mb-4 mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Interview Ready!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      You're all set for the AI interview. The session includes
                      6 carefully selected questions with varying difficulty
                      levels.
                    </p>
                  </div>

                  {/* Interview Info Cards */}
                  <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        2
                      </div>
                      <div className="text-sm font-semibold text-green-800">
                        Easy Questions
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        20 seconds each
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        2
                      </div>
                      <div className="text-sm font-semibold text-yellow-800">
                        Medium Questions
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">
                        60 seconds each
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        2
                      </div>
                      <div className="text-sm font-semibold text-red-800">
                        Hard Questions
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        2 minutes each
                      </div>
                    </div>
                  </div>
                </div>

                <InterviewView />
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-20 pb-8">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">IA</span>
              </div>
              <span className="text-sm font-medium">
                Powered by Next.js • AI Interview Assistant
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Revolutionizing the interview process with artificial intelligence
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);