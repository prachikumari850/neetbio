import { create } from 'zustand'
import { defaultFolders, initialBookmarks } from '@/data/mockBookmarks'

export const useBookmarkStore = create((set, get) => ({
    items: initialBookmarks,
    folders: defaultFolders,

    toggleItem: (item) => {
        const exists = get().items.some((current) => current.id === item.id)

        set((state) => ({
            items: exists
                ? state.items.filter((current) => current.id !== item.id)
                : [{ ...item, savedAt: new Date().toISOString() }, ...state.items],
        }))

        return !exists
    },

    removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

    moveItem: (id, folder) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, folder } : item,
            ),
        })),

    addFolder: (name) => set((state) => ({ folders: [...state.folders, name] })),

    clearItems: () => set({ items: [] }),
}))