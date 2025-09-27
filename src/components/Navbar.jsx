"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/interviewee", label: "Interviewee", icon: "👤" },
    { href: "/interviewer", label: "Interviewer", icon: "🎯" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/20 shadow-lg shadow-black/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IA</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              InterviewApp
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 bg-gray-100/50 rounded-full p-1 backdrop-blur-sm">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ease-in-out
                    flex items-center space-x-2 group
                    ${
                      isActive
                        ? "bg-white text-blue-600 shadow-lg shadow-blue-500/20 scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }
                  `}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>

                  {/* Animated background for active state */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full -z-10 animate-pulse" />
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          {/* <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:from-blue-700 hover:to-purple-700">
            Get Started
          </button> */}
        </div>
      </div>
    </nav>
  );
}
