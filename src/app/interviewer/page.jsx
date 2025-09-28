"use client";
import React, { useState, useMemo, useEffect } from "react";
import useCandidateStore from "../../store/candidateStore";
import { Table, Input, Tag } from "antd";
import Link from "next/link";

const { Search } = Input;

const InterviewerPage = () => {
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

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allCandidates.length;
    const avgScore =
      total > 0
        ? allCandidates.reduce((sum, c) => sum + c.interview.score, 0) / total
        : 0;
    const highPerformers = allCandidates.filter(
      (c) => c.interview.score >= 85
    ).length;
    const recentInterviews = allCandidates.filter((c) => {
      const interviewDate = new Date(c.id); // Using ID as timestamp
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return interviewDate > weekAgo;
    }).length;

    return { total, avgScore, highPerformers, recentInterviews };
  }, [allCandidates]);

  const columns = [
    {
      title: "Candidate",
      dataIndex: ["candidateData", "name"],
      key: "name",
      sorter: (a, b) =>
        a.candidateData.name.localeCompare(b.candidateData.name),
      render: (name, record) => (
        <Link
          href={`/interviewer/${record.id}`}
          className="group flex items-center space-x-3 hover:bg-blue-50 -m-2 p-2 rounded-xl transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              {name}
            </div>
            <div className="text-sm text-gray-500">
              {record.candidateData.email}
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: "Score",
      dataIndex: ["interview", "score"],
      key: "score",
      sorter: (a, b) => a.interview.score - b.interview.score,
      render: (score) => {
        const getScoreConfig = (score) => {
          if (score >= 85)
            return {
              color: "success",
              bg: "bg-green-50",
              text: "text-green-700",
              icon: "🏆",
            };
          if (score >= 70)
            return {
              color: "processing",
              bg: "bg-blue-50",
              text: "text-blue-700",
              icon: "👍",
            };
          return {
            color: "error",
            bg: "bg-red-50",
            text: "text-red-700",
            icon: "💪",
          };
        };

        const config = getScoreConfig(score);

        return (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl ${config.bg} border border-opacity-20`}
          >
            <span className="text-lg">{config.icon}</span>
            <span className={`font-bold text-lg ${config.text}`}>{score}</span>
            <span className="text-gray-500 text-sm">/100</span>
          </div>
        );
      },
      defaultSortOrder: "descend",
    },
    {
      title: "Performance Summary",
      dataIndex: ["interview", "summary"],
      key: "summary",
      render: (summary) => (
        <div className="max-w-md">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {summary}
          </p>
        </div>
      ),
    },
    {
      title: "Interview Date",
      dataIndex: "id",
      key: "date",
      sorter: (a, b) => new Date(a.id) - new Date(b.id),
      render: (id) => {
        const date = new Date(id);
        const isRecent = Date.now() - date.getTime() < 24 * 60 * 60 * 1000;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {date.toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-500">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isRecent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit mt-1">
                Recent
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 slide-up">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 mb-4 mx-auto">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Interviewer Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and review AI-powered interview results
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              label="Total Interviews"
              value={stats.total}
              color="blue"
            />
            <StatCard
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              label="Average Score"
              value={Math.round(stats.avgScore)}
              suffix="/100"
              color="green"
            />
            <StatCard
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              }
              label="High Performers"
              value={stats.highPerformers}
              suffix={`/${stats.total}`}
              color="purple"
            />
            <StatCard
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
              label="This Week"
              value={stats.recentInterviews}
              color="orange"
            />
          </div>
        </div>

        {/* Search and Table Section */}
        <div className="scale-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 overflow-hidden">
            {/* Search Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-800">
                    Interview Results ({filteredCandidates.length})
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  <Search
                    placeholder="Search by name or email..."
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full sm:w-80"
                    size="large"
                    style={{
                      borderRadius: "12px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="p-8">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchText
                      ? "No matching candidates found"
                      : "No interviews yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchText
                      ? "Try adjusting your search terms"
                      : "Interview results will appear here once candidates complete their sessions"}
                  </p>
                  {searchText && (
                    <button
                      onClick={() => setSearchText("")}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredCandidates}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    style: { marginTop: "2rem" },
                  }}
                  className="modern-table"
                  scroll={{ x: 800 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ icon, label, value, suffix = "", color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600 text-blue-600",
    green: "from-green-500 to-emerald-600 text-green-600",
    purple: "from-purple-500 to-violet-600 text-purple-600",
    orange: "from-orange-500 to-amber-600 text-orange-600",
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-black text-gray-900">
            {value}
            <span className="text-lg font-semibold text-gray-500 ml-1">
              {suffix}
            </span>
          </p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default InterviewerPage;