import toast from 'react-hot-toast'
import { useBookmarkStore } from '@/store/useBookmarkStore'

export function useBookmarkToggle() {
    const items = useBookmarkStore((state) => state.items)
    const toggleItem = useBookmarkStore((state) => state.toggleItem)

    const isBookmarked = (id) => items.some((item) => item.id === id)

    const toggle = (item) => {
        const wasAdded = toggleItem(item)
        toast.success(wasAdded ? 'Saved to bookmarks' : 'Removed from bookmarks')
    }

    return { isBookmarked, toggle }
}