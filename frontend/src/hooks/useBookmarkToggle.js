import toast from 'react-hot-toast'
import { BOOKMARK_LIMIT } from '@/data/mockBookmarks'
import { useBookmarkStore } from '@/store/useBookmarkStore'

export function useBookmarkToggle() {
    const items = useBookmarkStore((state) => state.items)
    const toggleItem = useBookmarkStore((state) => state.toggleItem)

    const isBookmarked = (id) => items.some((item) => item.id === id)

    const toggle = (item) => {
        if (!isBookmarked(item.id) && items.length >= BOOKMARK_LIMIT) {
            toast.error(`Bookmark limit reached (${BOOKMARK_LIMIT}). Remove one to save more.`)
            return
        }

        const wasAdded = toggleItem(item)
        toast.success(wasAdded ? 'Saved to bookmarks' : 'Removed from bookmarks')
    }

    return { isBookmarked, toggle }
}