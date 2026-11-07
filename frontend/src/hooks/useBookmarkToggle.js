import toast from 'react-hot-toast'
import { useBookmarkStore } from '@/store/useBookmarkStore'

export function useBookmarkToggle() {
    const items = useBookmarkStore((state) => state.items)
    const add = useBookmarkStore((state) => state.add)
    const remove = useBookmarkStore((state) => state.remove)

    const isBookmarked = (id) => items.some((item) => item.id === id)

    const toggle = async (item) => {
        try {
            if (isBookmarked(item.id)) {
                await remove(item.id)
                toast.success('Removed from bookmarks')
            } else {
                await add(item)
                toast.success('Saved to bookmarks')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return { isBookmarked, toggle }
}