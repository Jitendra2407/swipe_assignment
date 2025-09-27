import { create } from "zustand";

const useCandidateStore = create((set) => ({
  // State
  candidateData: {
    name: "",
    email: "",
    phone: "",
    rawText: "",
  },
  messages: [], // for chat messages
  isLoading: false,
  error: null,

  // Actions
  // Replace entire candidate data (used after resume parsing)
  setCandidateData: (data) =>
    set({
      candidateData: data,
      error: null,
    }),

  // Update single field (used by chat)
  setCandidateField: (field, value) =>
    set((state) => ({
      candidateData: { ...state.candidateData, [field]: value },
    })),

  // Chat messages actions
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, createdAt: Date.now() }],
    })),

  resetChat: () => set({ messages: [] }),

  // Loading / error actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearData: () =>
    set({
      candidateData: {
        name: "",
        email: "",
        phone: "",
        rawText: "",
      },
      messages: [],
      error: null,
      isLoading: false,
    }),
}));

export default useCandidateStore;
