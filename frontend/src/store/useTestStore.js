import { create } from 'zustand'
import { getPracticeStats, listAttempts } from '@/services/practiceService'

export const useTestStore = create((set) => ({
    results: [],
    stats: null,
    status: 'idle',

    load: async () => {
        try {
            const [results, stats] = await Promise.all([listAttempts(), getPracticeStats()])
            set({ results, stats, status: 'ready' })
        } catch {
            set({ status: 'error' })
        }
    },
}))