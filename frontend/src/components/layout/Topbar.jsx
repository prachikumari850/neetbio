import { useEffect, useRef, useState } from 'react'
import { Flame, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchInput from '@/components/common/SearchInput'
import NotificationMenu from '@/components/layout/NotificationMenu'
import UserMenu from '@/components/layout/UserMenu'
import { useLearningStore } from '@/store/useLearningStore'

function Topbar({ activeItem, onMenuClick }) {
    const [query, setQuery] = useState('')
    const searchInputRef = useRef(null)
    const navigate = useNavigate()
    const streak = useLearningStore((state) => state.summary?.streak.current ?? 0)

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isShortcut =
                (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'

            if (isShortcut) {
                event.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleSearch = (term) => {
        const trimmedTerm = term.trim()

        if (!trimmedTerm) {
            return
        }

        const targetPath = activeItem.searchPath ?? activeItem.path
        navigate(`${targetPath}?q=${encodeURIComponent(trimmedTerm)}`)
    }

    return (
        <header className="bg-page/80 sticky top-0 z-30 flex items-center gap-3 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <button
                type="button"
                aria-label="Open menu"
                onClick={onMenuClick}
                className="text-ink-900 hover:bg-brand-purple-soft rounded-full p-2 lg:hidden"
            >
                <Menu className="size-6" />
            </button>

            <SearchInput
                value={query}
                onChange={setQuery}
                onSubmit={handleSearch}
                placeholder={activeItem.searchPlaceholder}
                inputRef={searchInputRef}
                shortcutHint="Ctrl + K"
                className="max-w-2xl flex-1"
            />

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <NotificationMenu />
                <div className="bg-brand-purple-soft rounded-pill hidden items-center gap-2 px-5 py-2.5 text-sm font-bold sm:flex">
                    <Flame className="fill-brand-orange text-brand-orange size-5" />
                    {streak} Day Streak
                </div>
                <UserMenu />
            </div>
        </header>
    )
}

export default Topbar