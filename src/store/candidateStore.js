// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { v4 as uuidv4 } from "uuid";

// const useCandidateStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       allCandidates: [],
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
//               status: "preparing", // New status for generating questions
//               currentQuestionIndex: 0,
//             },
//           },
//         })),

//       // *** FIX IS HERE: New action to set all questions at once ***
//       setInterviewQuestions: (questions) =>
//         set((state) => ({
//           currentCandidate: {
//             ...state.currentCandidate,
//             interview: {
//               ...state.currentCandidate.interview,
//               questions: questions,
//               status: "in-progress", // Questions are ready, start the interview
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

//       finalizeAndArchiveInterview: (score, summary) => {
//         const { currentCandidate, allCandidates } = get();
//         const finalCandidate = {
//           ...currentCandidate,
//           interview: {
//             ...currentCandidate.interview,
//             score,
//             summary,
//           },
//         };
//         set({
//           allCandidates: [...allCandidates, finalCandidate],
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
//         });
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
//       name: "ai-interview-storage",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

// export default useCandidateStore;


import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const useCandidateStore = create(
  persist(
    (set, get) => ({
      // State
      allCandidates: [],
      currentCandidate: {
        id: null,
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
      },
      isLoading: false,
      error: null,

      // Actions
      setCandidateData: (data) =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            candidateData: data,
            id: uuidv4(),
          },
        })),

      setCandidateField: (field, value) =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            candidateData: {
              ...state.currentCandidate.candidateData,
              [field]: value,
            },
          },
        })),

      addMessage: (msg) =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            messages: [
              ...state.currentCandidate.messages,
              { ...msg, createdAt: Date.now() },
            ],
          },
        })),

      // --- Interview Actions ---
      startInterview: () =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            interview: {
              ...state.currentCandidate.interview,
              status: "preparing", // New status for generating questions
              currentQuestionIndex: 0,
            },
          },
        })),

      // *** FIX IS HERE: New action to set all questions at once ***
      setInterviewQuestions: (questions) =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            interview: {
              ...state.currentCandidate.interview,
              questions: questions,
              status: "in-progress", // Questions are ready, start the interview
            },
          },
        })),

      submitAnswer: (answer) => {
        const { currentCandidate } = get();
        const { interview } = currentCandidate;
        const newAnswers = [...interview.answers];
        newAnswers[interview.currentQuestionIndex] = answer;

        set({
          currentCandidate: {
            ...currentCandidate,
            interview: {
              ...interview,
              answers: newAnswers,
              currentQuestionIndex: interview.currentQuestionIndex + 1,
            },
          },
        });
      },

      endInterview: () =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            interview: {
              ...state.currentCandidate.interview,
              status: "completed",
            },
          },
        })),

      finalizeAndArchiveInterview: (score, summary) => {
        const { currentCandidate, allCandidates } = get();
        const finalCandidate = {
          ...currentCandidate,
          interview: {
            ...currentCandidate.interview,
            score,
            summary,
          },
        };
        set({
          allCandidates: [...allCandidates, finalCandidate],
          currentCandidate: {
            id: null,
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
          },
        });
      },

      // Loading / error actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),

      clearData: () =>
        set({
          currentCandidate: {
            id: null,
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
          },
        }),
    }),
    {
      name: "ai-interview-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCandidateStore;