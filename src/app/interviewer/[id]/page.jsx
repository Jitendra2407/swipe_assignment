"use client";
import React from "react";
import { useParams } from "next/navigation";
import useCandidateStore from "../../../store/candidateStore";
import { Card, Tag, Divider, Empty } from "antd";
import Link from "next/link";

const CandidateDetailPage = () => {
  const { id } = useParams();
  const allCandidates = useCandidateStore((state) => state.allCandidates);
  const candidate = allCandidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Empty description="Candidate not found or data is still loading." />
        <Link
          href="/interviewer"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { candidateData, interview } = candidate;

  return (
    <div className="p-8 bg-gray-50">
      <Link
        href="/interviewer"
        className="text-blue-600 hover:underline mb-6 block"
      >
        &larr; Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Candidate Info & Score */}
        <div className="md:col-span-1 space-y-6">
          <Card title="Candidate Profile">
            <p>
              <strong>Name:</strong> {candidateData.name}
            </p>
            <p>
              <strong>Email:</strong> {candidateData.email}
            </p>
            <p>
              <strong>Phone:</strong> {candidateData.phone}
            </p>
          </Card>

          <Card title="Interview Score & Summary">
            <div className="text-center mb-4">
              <span className="text-5xl font-bold text-blue-600">
                {interview.score}
              </span>
              /100
            </div>
            <p className="text-gray-600">{interview.summary}</p>
          </Card>
        </div>

        {/* Right Column: Q&A */}
        <div className="md:col-span-2">
          <Card title="Interview Transcript">
            {interview.questions.map((q, index) => (
              <div key={index} className="mb-6">
                <div className="font-semibold text-gray-800 mb-1">
                  <span>Question {index + 1} </span>
                  <Tag
                    color={
                      q.difficulty === "Easy"
                        ? "green"
                        : q.difficulty === "Medium"
                        ? "blue"
                        : "red"
                    }
                  >
                    {q.difficulty}
                  </Tag>
                </div>
                <p className="mb-2 italic">{q.text}</p>
                <div className="bg-gray-50 p-3 rounded-md border">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {interview.answers[index]}
                  </p>
                </div>
                {index < interview.questions.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
