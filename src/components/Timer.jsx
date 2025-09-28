// "use client";
// import { useState, useEffect } from "react";

// const Timer = ({ duration, onTimeout, questionIndex }) => {
//   const [timeLeft, setTimeLeft] = useState(duration);
//   const radius = 45;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (timeLeft / duration) * circumference;

//   useEffect(() => {
//     setTimeLeft(duration); // Reset timer on new question
//   }, [duration, questionIndex]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeout();
//       return;
//     }

//     const intervalId = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [timeLeft, onTimeout]);

//   const color =
//     timeLeft > duration * 0.5
//       ? "text-green-500"
//       : timeLeft > duration * 0.2
//       ? "text-yellow-500"
//       : "text-red-500";

//   return (
//     <div className="relative w-24 h-24">
//       <svg className="w-full h-full" viewBox="0 0 100 100">
//         {/* Background circle */}
//         <circle
//           className="text-gray-200"
//           strokeWidth="10"
//           stroke="currentColor"
//           fill="transparent"
//           r={radius}
//           cx="50"
//           cy="50"
//         />
//         {/* Progress circle */}
//         <circle
//           className={color}
//           strokeWidth="10"
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           stroke="currentColor"
//           fill="transparent"
//           r={radius}
//           cx="50"
//           cy="50"
//           style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
//         />
//       </svg>
//       <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//         <span className={`text-2xl font-bold ${color}`}>{timeLeft}s</span>
//       </div>
//     </div>
//   );
// };

// export default Timer;


"use client";
import { useState, useEffect } from "react";

const Timer = ({ duration, onTimeout, questionIndex }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isUrgent, setIsUrgent] = useState(false);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = ((duration - timeLeft) / duration) * circumference;
  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  useEffect(() => {
    setTimeLeft(duration);
    setIsUrgent(false);
  }, [duration, questionIndex]);

  useEffect(() => {
    // Mark as urgent when less than 20% time remaining
    setIsUrgent(timeLeft <= duration * 0.2);
  }, [timeLeft, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout]);

  const getTimerColors = () => {
    if (timeLeft > duration * 0.5) {
      return {
        circle: "stroke-green-500",
        background: "stroke-green-100",
        text: "text-green-600",
        glow: "drop-shadow-lg",
        pulse: "",
      };
    } else if (timeLeft > duration * 0.2) {
      return {
        circle: "stroke-yellow-500",
        background: "stroke-yellow-100",
        text: "text-yellow-600",
        glow: "drop-shadow-lg",
        pulse: "",
      };
    } else {
      return {
        circle: "stroke-red-500",
        background: "stroke-red-100",
        text: "text-red-600",
        glow: "drop-shadow-2xl",
        pulse: isUrgent ? "animate-pulse" : "",
      };
    }
  };

  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  const colors = getTimerColors();

  return (
    <div className={`relative ${colors.pulse}`}>
      {/* Main Timer Circle */}
      <div className="relative w-32 h-32">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* Background Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${colors.background} fill-none`}
            strokeWidth="8"
          />

          {/* Progress Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className={`${colors.circle} fill-none ${colors.glow} transition-all duration-500`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{
              filter: isUrgent ? "drop-shadow(0 0 8px currentColor)" : "none",
            }}
          />

          {/* Inner decorative circle */}
          <circle
            cx="60"
            cy="60"
            r="35"
            className="fill-white/80 stroke-gray-200"
            strokeWidth="1"
          />
        </svg>

        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Time Display */}
          <div
            className={`text-2xl font-black ${colors.text} mb-1 transition-colors duration-300`}
          >
            {formatTime(timeLeft)}
          </div>

          {/* Progress Percentage */}
          <div className="text-xs font-semibold text-gray-500">
            {Math.round(progressPercentage)}%
          </div>
        </div>

        {/* Urgent Warning Indicator */}
        {isUrgent && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mt-3">
        <div
          className={`text-xs font-semibold ${colors.text} transition-colors duration-300`}
        >
          {timeLeft > duration * 0.5
            ? "Good Time"
            : timeLeft > duration * 0.2
            ? "Hurry Up"
            : "Time Running Out!"}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Glow effect for urgent state */}
        {isUrgent && (
          <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" />
        )}

        {/* Subtle background glow */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            timeLeft > duration * 0.5
              ? "bg-green-500/5"
              : timeLeft > duration * 0.2
              ? "bg-yellow-500/5"
              : "bg-red-500/10"
          }`}
        />
      </div>
    </div>
  );
};

export default Timer;