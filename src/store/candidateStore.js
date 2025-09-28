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
              status: "preparing",
              currentQuestionIndex: 0,
            },
          },
        })),

      setInterviewQuestions: (questions) =>
        set((state) => ({
          currentCandidate: {
            ...state.currentCandidate,
            interview: {
              ...state.currentCandidate.interview,
              questions: questions,
              status: "in-progress",
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

      // *** FIX: Prevent duplicate candidates and ensure proper archiving ***
      setFinalAnalysisAndArchive: (score, summary) => {
        const { currentCandidate, allCandidates } = get();

        // Create the final candidate with analysis results
        const finalCandidate = {
          ...currentCandidate,
          interview: {
            ...currentCandidate.interview,
            score,
            summary,
          },
        };

        // *** CRITICAL FIX: Check if candidate already exists before adding ***
        const existingCandidateIndex = allCandidates.findIndex(
          (candidate) => candidate.id === currentCandidate.id
        );

        let updatedAllCandidates;

        if (existingCandidateIndex !== -1) {
          // Update existing candidate
          updatedAllCandidates = [...allCandidates];
          updatedAllCandidates[existingCandidateIndex] = finalCandidate;
          console.log("Updated existing candidate in dashboard");
        } else {
          // Add new candidate only if it doesn't exist
          updatedAllCandidates = [...allCandidates, finalCandidate];
          console.log("Added new candidate to dashboard");
        }

        set({
          allCandidates: updatedAllCandidates,
          currentCandidate: finalCandidate, // Keep the completed data in the current view
        });
      },

      // Loading / error actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),

      // This action is called manually by the user to start a new session
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

      // *** NEW: Helper action to remove duplicate candidates (if any exist) ***
      removeDuplicateCandidates: () => {
        const { allCandidates } = get();

        // Create a Map to track unique candidates by ID
        const uniqueCandidatesMap = new Map();

        allCandidates.forEach((candidate) => {
          if (candidate.id && !uniqueCandidatesMap.has(candidate.id)) {
            uniqueCandidatesMap.set(candidate.id, candidate);
          }
        });

        const uniqueCandidates = Array.from(uniqueCandidatesMap.values());

        // Only update if duplicates were found
        if (uniqueCandidates.length !== allCandidates.length) {
          console.log(
            `Removed ${
              allCandidates.length - uniqueCandidates.length
            } duplicate candidates`
          );
          set({ allCandidates: uniqueCandidates });
        }
      },
    }),
    {
      name: "ai-interview-storage",
      storage: createJSONStorage(() => localStorage),
      // *** FIX: Add onRehydrateStorage to clean up duplicates on app load ***
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Clean up any existing duplicates when the app loads
          setTimeout(() => {
            state.removeDuplicateCandidates?.();
          }, 100);
        }
      },
    }
  )
);

export default useCandidateStore;