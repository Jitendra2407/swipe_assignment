// components/CandidateInfo.js
"use client";

import useCandidateStore from "../store/candidateStore";

const CandidateInfo = () => {
  // const { candidateData, clearData } = useCandidateStore();
  // const { name, email, phone, rawText } = candidateData;
  const { currentCandidate, clearData } = useCandidateStore();
  const { name, email, phone, rawText } = currentCandidate?.candidateData ?? {};


  // Don't render if no data
  if (!name && !email && !phone && !rawText) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Extracted Candidate Information
            </h3>
            <button
              onClick={clearData}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 
                       border border-gray-300 rounded-md hover:bg-gray-100
                       transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="block text-sm font-medium text-gray-700 sm:w-20">
              Name:
            </label>
            <div className="mt-1 sm:mt-0 sm:ml-4 flex-1">
              {name ? (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {name}
                </p>
              ) : (
                <p className="text-sm text-red-500 italic">Not found</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="block text-sm font-medium text-gray-700 sm:w-20">
              Email:
            </label>
            <div className="mt-1 sm:mt-0 sm:ml-4 flex-1">
              {email ? (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {email}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-red-500 italic">Not found</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="block text-sm font-medium text-gray-700 sm:w-20">
              Phone:
            </label>
            <div className="mt-1 sm:mt-0 sm:ml-4 flex-1">
              {phone ? (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {phone}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-red-500 italic">Not found</p>
              )}
            </div>
          </div>
        </div>

        {/* Raw Text Preview */}
        {rawText && (
          <div className="px-6 py-4 border-t border-gray-200">
            <details className="group">
              <summary
                className="cursor-pointer text-sm font-medium text-gray-700 
                               hover:text-gray-900 select-none"
              >
                <span
                  className="inline-block transform transition-transform duration-200 
                               group-open:rotate-90"
                >
                  ▶
                </span>
                <span className="ml-2">
                  View Raw Text ({rawText.length} characters)
                </span>
              </summary>
              <div className="mt-3 p-3 bg-gray-50 rounded-md border max-h-64 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {rawText}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge label="Name" found={!!name} />
        <StatusBadge label="Email" found={!!email} />
        <StatusBadge label="Phone" found={!!phone} />
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ label, found }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${found ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full mr-1.5
        ${found ? "bg-green-400" : "bg-red-400"}`}
    />
    {label} {found ? "Found" : "Missing"}
  </span>
);

export default CandidateInfo;
