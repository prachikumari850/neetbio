import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserStore } from '@/store/useUserStore'

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearSession: () => {
                set({ token: null })
                useUserStore.getState().resetUser()
            },
        }),
        {
            name: 'neetbio-auth',
            partialize: (state) => ({ token: state.token }),
        },
    ),
)