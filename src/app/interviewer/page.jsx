"use client";
import React, { useState, useMemo, useEffect } from "react";
import useCandidateStore from "../../store/candidateStore";
import { Table, Input, Tag } from "antd";
import Link from "next/link";

const { Search } = Input;

const InterviewerPage = () => {
  // We need to ensure the component re-renders when client-side storage is hydrated.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const allCandidates = useCandidateStore((state) => state.allCandidates);
  const [searchText, setSearchText] = useState("");

  const filteredCandidates = useMemo(() => {
    if (!searchText) return allCandidates;
    return allCandidates.filter(
      (c) =>
        c.candidateData.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.candidateData.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allCandidates, searchText]);

  const columns = [
    {
      title: "Name",
      dataIndex: ["candidateData", "name"],
      key: "name",
      sorter: (a, b) =>
        a.candidateData.name.localeCompare(b.candidateData.name),
      render: (name, record) => (
        <Link
          href={`/interviewer/${record.id}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          {name}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: ["candidateData", "email"],
      key: "email",
      sorter: (a, b) =>
        a.candidateData.email.localeCompare(b.candidateData.email),
    },
    {
      title: "Score",
      dataIndex: ["interview", "score"],
      key: "score",
      sorter: (a, b) => a.interview.score - b.interview.score,
      render: (score) => {
        let color = score > 85 ? "green" : score > 70 ? "geekblue" : "volcano";
        return (
          <Tag
            color={color}
            key={score}
            style={{ fontSize: "14px", padding: "4px 8px" }}
          >
            {score}
          </Tag>
        );
      },
      defaultSortOrder: "descend",
    },
    {
      title: "AI Summary",
      dataIndex: ["interview", "summary"],
      key: "summary",
      ellipsis: true,
    },
  ];

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Interviewer Dashboard</h1>
      <div className="mb-4">
        <Search
          placeholder="Search by name or email"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default InterviewerPage;
