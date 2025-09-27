// store/candidateStore.js
import { create } from "zustand";

const useCandidateStore = create((set) => ({
  // State
  candidateData: {
    name: "",
    email: "",
    phone: "",
    rawText: "",
  },
  isLoading: false,
  error: null,

  // Actions
  setCandidateData: (data) =>
    set({
      candidateData: data,
      error: null,
    }),

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
      error: null,
      isLoading: false,
    }),
}));

export default useCandidateStore;
