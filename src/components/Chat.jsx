// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import useCandidateStore from "../store/candidateStore";

// const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
// const QUESTIONS = {
//   name: "I couldn't detect your full name from the resume. Could you tell me your full name?",
//   email: "I couldn't find an email address on the resume. What's your email?",
//   phone:
//     "I couldn't find a phone number on the resume. What's the best phone number?",
// };

// export default function Chat() {
//   const { candidateData, messages } = useCandidateStore(
//     (s) => s.currentCandidate
//   );
//   const addMessage = useCandidateStore((s) => s.addMessage);
//   const setCandidateField = useCandidateStore((s) => s.setCandidateField);

//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const inputRef = useRef();

//   const requiredFields = ["name", "email", "phone"];
//   const askedFieldsRef = useRef([]);
//   const firstQuestionAsked = useRef(false);

//   const getMissingFields = () => {
//     if (!candidateData) return [];
//     return requiredFields.filter(
//       (f) => !candidateData[f] || candidateData[f].toString().trim() === ""
//     );
//   };

//   const fieldLabel = (field) =>
//     field === "name"
//       ? "full name"
//       : field === "email"
//       ? "email"
//       : "phone number";

//   const askNextField = () => {
//     const missing = getMissingFields().filter(
//       (f) => !askedFieldsRef.current.includes(f)
//     );
//     if (missing.length > 0) {
//       const field = missing[0];
//       addMessage({
//         id: genId(),
//         role: "assistant",
//         text: QUESTIONS[field],
//         fieldAsked: field,
//       });
//       setCurrentQuestion(field);
//       askedFieldsRef.current.push(field);
//       setTimeout(() => inputRef.current?.focus(), 50);
//     } else {
//       setCurrentQuestion(null);
//     }
//   };

//   // Trigger first question only once after resume upload
//   useEffect(() => {
//     if (!candidateData?.rawText) return;
//     if (getMissingFields().length === 0) return;
//     if (firstQuestionAsked.current) return;

//     firstQuestionAsked.current = true;

//     // Initialize asked fields with already filled candidate data
//     askedFieldsRef.current = requiredFields.filter(
//       (f) => candidateData[f] && candidateData[f].trim() !== ""
//     );

//     addMessage({
//       id: genId(),
//       role: "system",
//       text: "Hi! I will ask a few quick questions to complete your profile.",
//     });

//     askNextField();
//   }, [candidateData?.rawText]);

//   if (!candidateData?.rawText || getMissingFields().length === 0) return null;

//   const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//   const validatePhone = (value) => {
//     const digits = value.replace(/[^0-9]/g, "");
//     return digits.length >= 7 && digits.length <= 15;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const answer = inputValue.trim();
//     if (!answer || !currentQuestion) return;

//     let isValid = true;
//     let errorMsg = "";

//     if (currentQuestion === "email" && !validateEmail(answer)) {
//       isValid = false;
//       errorMsg = "That doesn't look like a valid email.";
//     } else if (currentQuestion === "phone" && !validatePhone(answer)) {
//       isValid = false;
//       errorMsg = "Please enter a valid phone number.";
//     } else if (currentQuestion === "name" && answer.length < 2) {
//       isValid = false;
//       errorMsg = "Please enter your full name (at least 2 characters).";
//     }

//     if (!isValid) {
//       addMessage({ id: genId(), role: "assistant", text: errorMsg });
//       setInputValue("");
//       return;
//     }

//     setCandidateField(currentQuestion, answer);
//     addMessage({ id: genId(), role: "user", text: answer });
//     addMessage({
//       id: genId(),
//       role: "assistant",
//       text: `Thanks! I've saved your ${fieldLabel(currentQuestion)}.`,
//     });

//     setInputValue("");
//     askNextField();
//   };

//   return (
//     <div className="flex flex-col border border-gray-200 rounded-lg max-w-3xl p-4 bg-white shadow-md">
//       <div className="flex-1 h-80 overflow-y-auto p-3 mb-3 bg-gray-50 rounded-md space-y-2">
//         {messages.map((m) => (
//           <div key={m.id} className="flex flex-col">
//             <span className="text-xs text-gray-400">
//               {m.role === "system"
//                 ? "System"
//                 : m.role === "assistant"
//                 ? "Assistant"
//                 : "You"}
//             </span>
//             <div
//               className={`inline-block mt-1 px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
//                 m.role === "user"
//                   ? "bg-indigo-100 text-indigo-900 self-end"
//                   : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {m.text}
//             </div>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           ref={inputRef}
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder={
//             currentQuestion
//               ? `Enter your ${fieldLabel(currentQuestion)}...`
//               : "Type a message..."
//           }
//           className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }





"use client";
import React, { useEffect, useRef, useState } from "react";
import useCandidateStore from "../store/candidateStore";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const QUESTIONS = {
  name: "I couldn't detect your full name from the resume. Could you tell me your full name?",
  email: "I couldn't find an email address on the resume. What's your email?",
  phone:
    "I couldn't find a phone number on the resume. What's the best phone number?",
};

export default function Chat() {
  const { candidateData, messages } = useCandidateStore(
    (s) => s.currentCandidate
  );
  const addMessage = useCandidateStore((s) => s.addMessage);
  const setCandidateField = useCandidateStore((s) => s.setCandidateField);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef();
  const messagesEndRef = useRef();

  const requiredFields = ["name", "email", "phone"];
  const askedFieldsRef = useRef([]);
  const firstQuestionAsked = useRef(false);

  const getMissingFields = () => {
    if (!candidateData) return [];
    return requiredFields.filter(
      (f) => !candidateData[f] || candidateData[f].toString().trim() === ""
    );
  };

  const fieldLabel = (field) =>
    field === "name"
      ? "full name"
      : field === "email"
      ? "email"
      : "phone number";

  const askNextField = () => {
    const missing = getMissingFields().filter(
      (f) => !askedFieldsRef.current.includes(f)
    );
    if (missing.length > 0) {
      const field = missing[0];

      // Add typing animation
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          id: genId(),
          role: "assistant",
          text: QUESTIONS[field],
          fieldAsked: field,
        });
        setCurrentQuestion(field);
        askedFieldsRef.current.push(field);
        setTimeout(() => inputRef.current?.focus(), 50);
      }, 1000);
    } else {
      setCurrentQuestion(null);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Trigger first question only once after resume upload
  useEffect(() => {
    if (!candidateData?.rawText) return;
    if (getMissingFields().length === 0) return;
    if (firstQuestionAsked.current) return;

    firstQuestionAsked.current = true;

    askedFieldsRef.current = requiredFields.filter(
      (f) => candidateData[f] && candidateData[f].trim() !== ""
    );

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: genId(),
        role: "system",
        text: "Hi! I need to ask a few quick questions to complete your profile.",
      });
      setTimeout(() => askNextField(), 500);
    }, 800);
  }, [candidateData?.rawText]);

  if (!candidateData?.rawText || getMissingFields().length === 0) return null;

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = inputValue.trim();
    if (!answer || !currentQuestion) return;

    let isValid = true;
    let errorMsg = "";

    if (currentQuestion === "email" && !validateEmail(answer)) {
      isValid = false;
      errorMsg =
        "That doesn't look like a valid email address. Please try again.";
    } else if (currentQuestion === "phone" && !validatePhone(answer)) {
      isValid = false;
      errorMsg = "Please enter a valid phone number with at least 7 digits.";
    } else if (currentQuestion === "name" && answer.length < 2) {
      isValid = false;
      errorMsg = "Please enter your full name (at least 2 characters).";
    }

    // Add user message
    addMessage({ id: genId(), role: "user", text: answer });
    setInputValue("");

    if (!isValid) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage({ id: genId(), role: "assistant", text: errorMsg });
      }, 800);
      return;
    }

    // Valid answer
    setCandidateField(currentQuestion, answer);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: genId(),
        role: "assistant",
        text: `Perfect! I've saved your ${fieldLabel(currentQuestion)}. ✓`,
      });
      setTimeout(() => askNextField(), 1000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
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
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Assistant</h3>
            <p className="text-blue-100 text-sm">
              Let's complete your profile together
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border-l border-r border-gray-200">
        <div
          className="h-96 overflow-y-auto p-6 space-y-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
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
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-gray-50 rounded-b-2xl border-l border-r border-b border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentQuestion
                  ? `Enter your ${fieldLabel(currentQuestion)}...`
                  : "Type your message..."
              }
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none text-gray-800 placeholder-gray-500 transition-all duration-300"
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center space-x-2"
          >
            <span>Send</span>
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

// Individual Chat Message Component
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-green-500 to-emerald-600"
            : isSystem
            ? "bg-gradient-to-br from-purple-500 to-violet-600"
            : "bg-gradient-to-br from-blue-500 to-indigo-600"
        }`}
      >
        {isUser ? (
          <svg
            className="w-4 h-4 text-white"
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
        ) : (
          <svg
            className="w-4 h-4 text-white"
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
        )}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-xs lg:max-w-md ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md"
              : isSystem
              ? "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 rounded-bl-md border border-purple-200"
              : "bg-gray-100 text-gray-800 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 mt-1 px-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};