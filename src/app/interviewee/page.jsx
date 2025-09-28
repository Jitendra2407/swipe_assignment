// "use client";

// import FileUpload from "../../components/FileUpolad";
// import CandidateInfo from "../../components/CandidateInfo";
// import Chat from "../../components/Chat";
// import useCandidateStore from "../../store/candidateStore";
// import { useState, useEffect } from "react";

// export default function IntervieweePage() {
//   const candidate = useCandidateStore((s) => s.candidateData);
//   const [showChat, setShowChat] = useState(false);

//   // Show chat only if resume uploaded AND some info is missing
//   useEffect(() => {
//     const missingFields = ["name", "email", "phone"].filter(
//       (f) => !candidate[f] || candidate[f].toString().trim() === ""
//     );
//     // Show chat only if some missing AND rawText exists (resume uploaded)
//     setShowChat(candidate.rawText && missingFields.length > 0);
//   }, [candidate]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Resume Upload & Analysis
//           </h1>
//           <p className="text-gray-600 max-w-md mx-auto">
//             Upload your resume in PDF or DOCX format to extract your contact
//             information
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Upload Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Upload Your Resume
//             </h2>
//             <FileUpload />
//           </div>

//           {/* Results Section */}
//           <CandidateInfo />

//           {/* Chat Section: only show if some info missing after upload */}
//           {showChat && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//                 Complete Your Profile
//               </h2>
//               <Chat />
//             </div>
//           )}
//         </div>

//         {/* Instructions */}
//         <div className="max-w-2xl mx-auto mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <h3 className="text-sm font-medium text-blue-800 mb-2">
//             📋 Instructions:
//           </h3>
//           <ul className="text-xs text-blue-700 space-y-1">
//             <li>• Upload PDF or DOCX files only (max 5MB)</li>
//             <li>• Ensure your name, email, and phone are clearly visible</li>
//             <li>
//               • The system will automatically extract your contact information
//             </li>
//             <li>• Review the extracted data for accuracy</li>
//           </ul>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 text-sm text-gray-500">
//           <p>Powered by Next.js • Built for Sprint 3</p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import useCandidateStore from "../../store/candidateStore";
import FileUpload from "../../components/FileUpolad";
import CandidateInfo from "../../components/CandidateInfo";
import Chat from "../../components/Chat";
import InterviewView from "../../components/InterviewView";

export default function IntervieweePage() {
  const { candidateData, interview } = useCandidateStore();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const { name, email, phone } = candidateData;
    // Profile is complete if all required fields are filled
    setIsProfileComplete(!!(name && email && phone));
  }, [candidateData]);

  const hasUploadedResume = !!candidateData?.rawText;

  return (
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
                Begin by uploading your resume. Our AI will extract your details
                to get started.
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
  );
}