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
  const candidate = useCandidateStore((s) => s.candidateData);
  const messages = useCandidateStore((s) => s.messages);
  const addMessage = useCandidateStore((s) => s.addMessage);
  const setCandidateField = useCandidateStore((s) => s.setCandidateField);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  const requiredFields = ["name", "email", "phone"];
  const askedFieldsRef = useRef([]);
  const firstQuestionAsked = useRef(false);

  const getMissingFields = () =>
    requiredFields.filter(
      (f) => !candidate[f] || candidate[f].toString().trim() === ""
    );

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
      addMessage({
        id: genId(),
        role: "assistant",
        text: QUESTIONS[field],
        fieldAsked: field,
      });
      setCurrentQuestion(field);
      askedFieldsRef.current.push(field);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setCurrentQuestion(null);
    }
  };

  // Trigger first question only once after resume upload
  useEffect(() => {
    if (!candidate.rawText) return;
    if (getMissingFields().length === 0) return;
    if (firstQuestionAsked.current) return;

    firstQuestionAsked.current = true;

    // Initialize asked fields with already filled candidate data
    askedFieldsRef.current = requiredFields.filter(
      (f) => candidate[f] && candidate[f].trim() !== ""
    );

    addMessage({
      id: genId(),
      role: "system",
      text: "Hi! I will ask a few quick questions to complete your profile.",
    });

    askNextField();
  }, [candidate.rawText]);

  if (!candidate.rawText || getMissingFields().length === 0) return null;

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
      errorMsg = "That doesn't look like a valid email.";
    } else if (currentQuestion === "phone" && !validatePhone(answer)) {
      isValid = false;
      errorMsg = "Please enter a valid phone number.";
    } else if (currentQuestion === "name" && answer.length < 2) {
      isValid = false;
      errorMsg = "Please enter your full name (at least 2 characters).";
    }

    if (!isValid) {
      addMessage({ id: genId(), role: "assistant", text: errorMsg });
      setInputValue("");
      return;
    }

    setCandidateField(currentQuestion, answer);
    addMessage({ id: genId(), role: "user", text: answer });
    addMessage({
      id: genId(),
      role: "assistant",
      text: `Thanks! I've saved your ${fieldLabel(currentQuestion)}.`,
    });

    setInputValue("");
    askNextField();
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg max-w-3xl p-4 bg-white shadow-md">
      <div className="flex-1 h-80 overflow-y-auto p-3 mb-3 bg-gray-50 rounded-md space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="text-xs text-gray-400">
              {m.role === "system"
                ? "System"
                : m.role === "assistant"
                ? "Assistant"
                : "You"}
            </span>
            <div
              className={`inline-block mt-1 px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-indigo-100 text-indigo-900 self-end"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            currentQuestion
              ? `Enter your ${fieldLabel(currentQuestion)}...`
              : "Type a message..."
          }
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
