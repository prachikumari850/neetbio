import { create } from 'zustand'
import { getLearningSummary } from '@/services/learningService'

let pendingLoad = null

export const useLearningStore = create((set, get) => ({
    summary: null,
    status: 'idle',

    load: () => {
        if (pendingLoad) {
            return pendingLoad
        }

        if (!get().summary) {
            set({ status: 'loading' })
        }

        pendingLoad = getLearningSummary()
            .then((summary) => set({ summary, status: 'ready' }))
            .catch(() => set({ status: get().summary ? 'ready' : 'error' }))
            .finally(() => {
                pendingLoad = null
            })

        return pendingLoad
    },
}))