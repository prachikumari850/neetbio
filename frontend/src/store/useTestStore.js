import { create } from 'zustand'
import { initialTestResults } from '@/data/mockPractice'

export const useTestStore = create((set) => ({
    results: initialTestResults,
    addResult: (result) =>
        set((state) => ({ results: [result, ...state.results] })),
}))