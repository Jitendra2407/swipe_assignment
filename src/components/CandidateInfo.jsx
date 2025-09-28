"use client";
import useCandidateStore from "../store/candidateStore";

const CandidateInfo = () => {
  const { candidateData } = useCandidateStore(
    (state) => state.currentCandidate
  );
  const { clearData } = useCandidateStore();

  if (!candidateData) {
    return null;
  }

  const { name, email, phone, rawText } = candidateData;

  if (!name && !email && !phone && !rawText) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-white/50">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Candidate Information
                </h3>
                <p className="text-blue-100 text-sm">
                  Extracted from your resume
                </p>
              </div>
            </div>
            <button
              onClick={clearData}
              className="group px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
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
              <span>Reset</span>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="grid gap-6">
            {/* Information Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <InfoField
                icon={
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                label="Full Name"
                value={name}
                type="name"
              />

              {/* Email Field */}
              <InfoField
                icon={
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                label="Email Address"
                value={email}
                type="email"
              />

              {/* Phone Field */}
              <InfoField
                icon={
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
                label="Phone Number"
                value={phone}
                type="phone"
              />

              {/* Status Overview */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
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
                    <span>Extraction Status</span>
                  </h4>
                  <div className="space-y-3">
                    <StatusBadge label="Name" found={!!name} />
                    <StatusBadge label="Email" found={!!email} />
                    <StatusBadge label="Phone" found={!!phone} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Text Preview */}
          {rawText && (
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200/50 overflow-hidden">
              <details className="group">
                <summary className="cursor-pointer px-6 py-4 hover:bg-gray-100/50 transition-all duration-300 select-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="inline-block transform transition-transform duration-300 group-open:rotate-90 text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                        View Raw Resume Text
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {rawText.length.toLocaleString()} characters
                      </span>
                    </div>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-80 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {rawText}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual Info Field Component
const InfoField = ({ icon, label, value, type }) => {
  const renderValue = () => {
    if (!value) {
      return (
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-red-500 italic">Not found</span>
        </div>
      );
    }

    const baseClasses = "text-gray-800 font-medium break-words";

    switch (type) {
      case "email":
        return (
          <a
            href={`mailto:${value}`}
            className={`${baseClasses} text-blue-600 hover:text-blue-700 hover:underline transition-colors`}
          >
            {value}
          </a>
        );
      case "phone":
        return (
          <a
            href={`tel:${value.replace(/\D/g, "")}`}
            className={`${baseClasses} text-green-600 hover:text-green-700 hover:underline transition-colors`}
          >
            {value}
          </a>
        );
      default:
        return <span className={baseClasses}>{value}</span>;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-xl flex-shrink-0 ${
            value
              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
              : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            {label}
          </label>
          <div className="text-sm">{renderValue()}</div>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ label, found }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        found
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${
          found ? "bg-green-400" : "bg-red-400"
        }`}
      />
      {found ? "Found" : "Missing"}
    </span>
  </div>
);

export default CandidateInfo;