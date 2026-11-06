import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
    persist(
        (set) => ({
            profile: {
                phone: '+91 98765 43210',
                joined: 'Oct 15, 2026',
                learningGoal: 'NEET 2027',
                targetScore: '650+',
            },
            notifications: {
                studyReminders: true,
                newContent: true,
                testResults: true,
                achievements: true,
            },
            learning: {
                classLevel: 'NEET (Class 11–12)',
                preferredMode: 'Text + Visual',
                difficulty: 'Mixed',
            },
            storage: { offlineDiagrams: false },
            privacy: { shareAnalytics: true, twoStep: false },
            appearance: 'light',
            language: 'English',

            updateSection: (section, patch) =>
                set((state) => ({ [section]: { ...state[section], ...patch } })),
            setAppearance: (appearance) => set({ appearance }),
            setLanguage: (language) => set({ language }),
        }),
        { name: 'neetbio-settings' },
    ),
)