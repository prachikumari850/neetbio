import { create } from 'zustand'
import {
    clearBookmarks,
    createBookmark,
    createFolder,
    deleteBookmark,
    fetchBookmarks,
    moveBookmark,
} from '@/services/bookmarkService'

export const useBookmarkStore = create((set) => ({
    items: [],
    folders: [],
    status: 'idle',

    load: async () => {
        set({ status: 'loading' })

        try {
            const { items, folders } = await fetchBookmarks()
            set({ items, folders, status: 'ready' })
        } catch {
            set({ status: 'error' })
        }
    },

    add: async (item) => {
        const saved = await createBookmark(item)
        set((state) => ({ items: [saved, ...state.items] }))
    },

    remove: async (itemId) => {
        await deleteBookmark(itemId)
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }))
    },

    move: async (itemId, folder) => {
        const updated = await moveBookmark(itemId, folder)
        set((state) => ({
            items: state.items.map((item) => (item.id === itemId ? updated : item)),
        }))
    },

    addFolder: async (name) => {
        const folders = await createFolder(name)
        set({ folders })
    },

    clear: async () => {
        await clearBookmarks()
        set({ items: [] })
    },
}))