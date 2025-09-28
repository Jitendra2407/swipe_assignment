// // components/FileUpload.js
// "use client";

// import { useState, useRef } from "react";
// import useCandidateStore from "../store/candidateStore";

// const FileUpload = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const { isLoading, error, setLoading, setError, setCandidateData } =
//     useCandidateStore();

//   /**
//    * Handle file upload
//    * @param {File} file - File to upload
//    */
//   const handleFileUpload = async (file) => {
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = [
//       "application/pdf",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       setError("Please upload a PDF or DOCX file only");
//       return;
//     }

//     // Validate file size (5MB)
//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setError("File size must be less than 5MB");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("resume", file);

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || "Upload failed");
//       }

//       if (result.success) {
//         setCandidateData(result.data);

//         // Show warnings if validation failed
//         if (!result.validation.isValid) {
//           setError(`Warnings: ${result.validation.errors.join(", ")}`);
//         }
//       } else {
//         throw new Error(result.error || "Upload failed");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setError(error.message || "Failed to upload and parse resume");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle drag events
//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   // Handle drop
//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       handleFileUpload(files[0]);
//     }
//   };

//   // Handle file input change
//   const handleInputChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       handleFileUpload(files[0]);
//     }
//   };

//   // Handle click to open file dialog
//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div
//         className={`
//           relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
//           transition-colors duration-200 ease-in-out
//           ${
//             dragActive
//               ? "border-blue-400 bg-blue-50"
//               : "border-gray-300 hover:border-gray-400"
//           }
//           ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
//         `}
//         onDragEnter={handleDrag}
//         onDragLeave={handleDrag}
//         onDragOver={handleDrag}
//         onDrop={handleDrop}
//         onClick={!isLoading ? handleClick : undefined}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".pdf,.docx"
//           onChange={handleInputChange}
//           disabled={isLoading}
//           className="hidden"
//         />

//         <div className="flex flex-col items-center justify-center space-y-3">
//           {isLoading ? (
//             <>
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="text-sm text-gray-600">Processing resume...</p>
//             </>
//           ) : (
//             <>
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                 />
//               </svg>
//               <div>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium text-blue-600">
//                     Click to upload
//                   </span>{" "}
//                   or drag and drop
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   PDF or DOCX files only (max 5MB)
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;



"use client";

import { useState, useRef } from "react";
import useCandidateStore from "../store/candidateStore";

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { isLoading, error, setLoading, setError, setCandidateData } =
    useCandidateStore();

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file only");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.success) {
        setCandidateData(result.data);

        if (!result.validation.isValid) {
          setError(`Warnings: ${result.validation.errors.join(", ")}`);
        }
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload and parse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`
          relative border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer
          transition-all duration-500 ease-out group overflow-hidden
          ${
            dragActive
              ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-xl shadow-blue-500/20"
              : "border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50"
          }
          ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg hover:shadow-gray-200"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isLoading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          disabled={isLoading}
          className="hidden"
        />

        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex flex-col items-center justify-center space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              {/* Modern loading spinner */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                {/* Pulsing dots */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-700 mb-1">
                  Processing resume...
                </p>
                <p className="text-sm text-gray-500">
                  AI is analyzing your document
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Upload icon with animation */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-600 group-hover:text-blue-700">
                    Click to browse
                  </span>{" "}
                  or drag and drop your file here
                </p>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-600">
                      PDF
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium text-blue-600">
                      DOCX
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  Maximum file size: 5MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      </div>

      {/* Error message with modern styling */}
      {error && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;