import { create } from 'zustand'

const guestUser = {
    name: 'Student',
    fullName: '',
    role: 'NEET Aspirant',
    email: '',
    mobile: '',
    joinedAt: null,
    avatar: '/images/avatar.png',
}

export const useUserStore = create((set) => ({
    user: guestUser,
    setUser: (details) =>
        set((state) => ({ user: { ...state.user, ...details } })),
    resetUser: () => set({ user: guestUser }),
}))