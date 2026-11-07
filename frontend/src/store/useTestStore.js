import { create } from 'zustand'
import { getPracticeStats, listAttempts } from '@/services/practiceService'
import { useLearningStore } from '@/store/useLearningStore'

export const useTestStore = create((set) => ({
    results: [],
    stats: null,
    status: 'idle',

    load: async () => {
        useLearningStore.getState().load()

        try {
            const [results, stats] = await Promise.all([listAttempts(), getPracticeStats()])
            set({ results, stats, status: 'ready' })
        } catch {
            set({ status: 'error' })
        }
    },
}))