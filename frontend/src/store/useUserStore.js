import { create } from 'zustand'

export const useUserStore = create((set) => ({
    user: {
        name: 'Ashu',
        role: 'NEET Aspirant',
        email: 'ashu@example.com',
        avatar: '/images/avatar.png',
        streak: 12,
    },
    setUser: (details) =>
        set((state) => ({ user: { ...state.user, ...details } })),
}))