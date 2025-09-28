"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      href: "/interviewee",
      label: "Interviewee",
      icon: (
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
      ),
    },
    {
      href: "/interviewer",
      label: "Interviewer",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-2xl shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <span className="text-white font-bold text-lg">IA</span>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-2xl bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                InterviewApp
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                AI-Powered Interviews
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 bg-gray-100/50 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-out
                    flex items-center space-x-3 group overflow-hidden
                    ${
                      isActive
                        ? "bg-white text-blue-600 shadow-lg shadow-blue-500/20 scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                    }
                  `}
                >
                  {/* Icon with animation */}
                  <span
                    className={`transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>

                  {/* Active indicator with gradient */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl animate-pulse" />
                      <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-1/2 translate-y-1" />
                    </>
                  )}

                  {/* Hover effect with sliding animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu indicator - for future mobile optimization */}
          <div className="sm:hidden w-12" />
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </nav>
  );
}

