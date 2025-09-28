import { create } from "zustand";

const useCandidateStore = create((set, get) => ({
  // State
  candidateData: {
    name: "",
    email: "",
    phone: "",
    rawText: "",
  },
  messages: [],
  interview: {
    questions: [], // { text, difficulty }
    answers: [],
    currentQuestionIndex: 0,
    status: "idle", // idle, in-progress, completed
    score: 0,
    summary: "",
  },
  isLoading: false,
  error: null,

  // Actions
  setCandidateData: (data) =>
    set({
      candidateData: data,
      error: null,
    }),

  setCandidateField: (field, value) =>
    set((state) => ({
      candidateData: { ...state.candidateData, [field]: value },
    })),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, createdAt: Date.now() }],
    })),

  // --- Interview Actions ---
  startInterview: () =>
    set((state) => ({
      interview: {
        ...state.interview,
        status: "in-progress",
        currentQuestionIndex: 0,
      },
    })),

  addQuestion: (question) =>
    set((state) => ({
      interview: {
        ...state.interview,
        questions: [...state.interview.questions, question],
      },
    })),

  submitAnswer: (answer) => {
    const { interview } = get();
    const newAnswers = [...interview.answers];
    newAnswers[interview.currentQuestionIndex] = answer;

    set({
      interview: {
        ...interview,
        answers: newAnswers,
        currentQuestionIndex: interview.currentQuestionIndex + 1,
      },
    });
  },

  endInterview: () =>
    set((state) => ({
      interview: { ...state.interview, status: "completed" },
    })),

  setScoreAndSummary: (score, summary) =>
    set((state) => ({
      interview: { ...state.interview, score, summary },
    })),

  // --- End Interview Actions ---

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearData: () =>
    set({
      candidateData: { name: "", email: "", phone: "", rawText: "" },
      messages: [],
      interview: {
        questions: [],
        answers: [],
        currentQuestionIndex: 0,
        status: "idle",
        score: 0,
        summary: "",
      },
      error: null,
      isLoading: false,
    }),
}));

export default useCandidateStore;



// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { v4 as uuidv4 } from "uuid";

// const useCandidateStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       allCandidates: [], // This will store all completed interviews
//       currentCandidate: {
//         id: null,
//         candidateData: { name: "", email: "", phone: "", rawText: "" },
//         messages: [],
//         interview: {
//           questions: [],
//           answers: [],
//           currentQuestionIndex: 0,
//           status: "idle",
//           score: 0,
//           summary: "",
//         },
//       },
//       isLoading: false,
//       error: null,

//       // Actions
//       setCandidateData: (data) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             candidateData: data,
//             id: uuidv4(),
//           },
//         })),

//       setCandidateField: (field, value) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             candidateData: {
//               ...state.currentCandidate.candidateData,
//               [field]: value,
//             },
//           },
//         })),

//       addMessage: (msg) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             messages: [
//               ...state.currentCandidate.messages,
//               { ...msg, createdAt: Date.now() },
//             ],
//           },
//         })),

//       // --- Interview Actions ---
//       startInterview: () =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             interview: {
//               ...state.currentCandidate.interview,
//               status: "in-progress",
//               currentQuestionIndex: 0,
//             },
//           },
//         })),

//       addQuestion: (question) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             interview: {
//               ...state.currentCandidate.interview,
//               questions: [
//                 ...state.currentCandidate.interview.questions,
//                 question,
//               ],
//             },
//           },
//         })),

//       submitAnswer: (answer) => {
//         const { currentCandidate } = get();
//         const { interview } = currentCandidate;
//         const newAnswers = [...interview.answers];
//         newAnswers[interview.currentQuestionIndex] = answer;

//         set({
//           currentCandidate: {
//             ...currentCandidate,
//             interview: {
//               ...interview,
//               answers: newAnswers,
//               currentQuestionIndex: interview.currentQuestionIndex + 1,
//             },
//           },
//         });
//       },

//       endInterview: () =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             interview: {
//               ...state.currentCandidate.interview,
//               status: "completed",
//             },
//           },
//         })),

//       setScoreAndSummary: (score, summary) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             interview: { ...state.currentCandidate.interview, score, summary },
//           },
//         })),

//       // --- New Action to Archive Interview ---
//       archiveCurrentInterview: () => {
//         const { currentCandidate, allCandidates } = get();
//         if (
//           currentCandidate.interview.status === "completed" &&
//           currentCandidate.interview.score > 0
//         ) {
//           set({
//             allCandidates: [...allCandidates, currentCandidate],
//             // Reset for the next candidate
//             currentCandidate: {
//               id: null,
//               candidateData: { name: "", email: "", phone: "", rawText: "" },
//               messages: [],
//               interview: {
//                 questions: [],
//                 answers: [],
//                 currentQuestionIndex: 0,
//                 status: "idle",
//                 score: 0,
//                 summary: "",
//               },
//             },
//           });
//         }
//       },

//       // Loading / error actions
//       setLoading: (loading) => set({ isLoading: loading }),
//       setError: (error) => set({ error, isLoading: false }),

//       clearData: () =>
//         set({
//           currentCandidate: {
//             id: null,
//             candidateData: { name: "", email: "", phone: "", rawText: "" },
//             messages: [],
//             interview: {
//               questions: [],
//               answers: [],
//               currentQuestionIndex: 0,
//               status: "idle",
//               score: 0,
//               summary: "",
//             },
//           },
//         }),
//     }),
//     {
//       name: "ai-interview-storage", // Name for the localStorage item
//       storage: createJSONStorage(() => localStorage), // Use localStorage
//     }
//   )
// );

// // We need a unique ID for each candidate, so let's install the `uuid` library.
// // Run this command in your terminal:
// // npm install uuid

// export default useCandidateStore;