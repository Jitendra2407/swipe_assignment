"use client";
import { useState, useEffect } from "react";
import useCandidateStore from "../../store/candidateStore";
import FileUpload from "../../components/FileUpolad";
import CandidateInfo from "../../components/CandidateInfo";
import Chat from "../../components/Chat";
import InterviewView from "../../components/InterviewView";
import WelcomeBackModal from "../../components/WelcomeBackModal";

export default function IntervieweePage() {
  const { currentCandidate, clearData } = useCandidateStore();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // This effect runs once to signal that we are on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // *** FIX IS HERE ***
  // This new effect will run whenever the interview status changes,
  // including after the store is hydrated from localStorage.
  useEffect(() => {
    if (isClient && currentCandidate.interview?.status === "in-progress") {
      setShowWelcomeBackModal(true);
    }
  }, [isClient, currentCandidate.interview?.status]);

  useEffect(() => {
    if (currentCandidate.candidateData) {
      const { name, email, phone } = currentCandidate.candidateData;
      setIsProfileComplete(!!(name && email && phone));
    } else {
      setIsProfileComplete(false);
    }
  }, [currentCandidate.candidateData]);

  const hasUploadedResume = !!currentCandidate.candidateData?.rawText;

  const handleResume = () => {
    setShowWelcomeBackModal(false);
  };

  const handleStartOver = () => {
    clearData();
    setShowWelcomeBackModal(false);
  };

  if (!isClient) {
    // Render nothing or a loading spinner on the server and before hydration.
    return null;
  }

  return (
    <>
      <WelcomeBackModal
        isOpen={showWelcomeBackModal}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1: Upload Resume */}
            {!hasUploadedResume && (
              <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  AI Interview Assistant
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Begin by uploading your resume. Our AI will extract your
                  details to get started.
                </p>
              </div>
            )}

            {!isProfileComplete && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {!hasUploadedResume
                    ? "Upload Your Resume"
                    : "Review Your Information"}
                </h2>
                {!hasUploadedResume && <FileUpload />}
                <CandidateInfo />
                {hasUploadedResume && !isProfileComplete && <Chat />}
              </div>
            )}

            {/* Step 2: Start Interview */}
            {isProfileComplete && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Interview Stage
                  </h1>
                  <p className="text-lg text-gray-600">
                    The interview consists of 6 timed questions. Good luck!
                  </p>
                </div>
                <InterviewView />
              </div>
            )}
          </div>

          <div className="text-center mt-16 text-sm text-gray-500">
            <p>Powered by Next.js • AI Interview Assistant</p>
          </div>
        </div>
      </div>
    </>
  );
}