import { useState } from 'react'
import { Bookmark, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import BookmarkCard from '@/components/bookmarks/BookmarkCard'
import FolderSidebar from '@/components/bookmarks/FolderSidebar'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ConfirmModal from '@/components/common/ConfirmModal'
import EmptyState from '@/components/common/EmptyState'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PageHeader from '@/components/common/PageHeader'
import SelectField from '@/components/common/SelectField'
import Tabs from '@/components/common/Tabs'
import { bookmarkSortOptions, bookmarkTypeMeta } from '@/data/mockBookmarks'
import { useBookmarkStore } from '@/store/useBookmarkStore'

const ALL = 'all'

const sorters = {
    recent: (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
    oldest: (a, b) => new Date(a.savedAt) - new Date(b.savedAt),
    title: (a, b) => a.title.localeCompare(b.title),
}

function Bookmarks() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [typeFilter, setTypeFilter] = useState(ALL)
    const [activeFolder, setActiveFolder] = useState(ALL)
    const [sort, setSort] = useState('recent')
    const [isClearOpen, setIsClearOpen] = useState(false)

    const { items, folders, status, load, remove, move, addFolder, clear } = useBookmarkStore()

    const query = searchParams.get('q') ?? ''

    const updateQuery = (value) => {
        setSearchParams(value ? { q: value } : {}, { replace: true })
    }

    const countByType = (type) => items.filter((item) => item.type === type).length

    const typeTabs = [
        { id: ALL, label: `All Bookmarks (${items.length})` },
        ...Object.entries(bookmarkTypeMeta).map(([type, { label, icon }]) => ({
            id: type,
            label: `${label}s (${countByType(type)})`,
            icon,
        })),
    ]

    const normalizedQuery = query.trim().toLowerCase()
    const visibleItems = items
        .filter(
            (item) =>
                (typeFilter === ALL || item.type === typeFilter) &&
                (activeFolder === ALL || item.folder === activeFolder) &&
                (!normalizedQuery ||
                    [item.title, item.subtitle].some((text) => text.toLowerCase().includes(normalizedQuery))),
        )
        .sort(sorters[sort])

    const runAction = async (action, successMessage) => {
        try {
            await action()
            toast.success(successMessage)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleRemove = (item) => runAction(() => remove(item.id), 'Removed from bookmarks')

    const handleMove = (item, folder) =>
        runAction(() => move(item.id, folder), `Moved to ${folder}`)

    const handleClear = async () => {
        setIsClearOpen(false)
        await runAction(clear, 'All bookmarks removed')
    }

    const renderItems = () => {
        if (status === 'error') {
            return (
                <EmptyState
                    icon={Bookmark}
                    title="Couldn’t load your bookmarks"
                    description="Check that the backend is running and try again."
                >
                    <Button variant="soft" onClick={load}>
                        Try again
                    </Button>
                </EmptyState>
            )
        }

        if (status !== 'ready') {
            return <LoadingSpinner label="Loading bookmarks..." />
        }

        if (visibleItems.length === 0) {
            const hasNoBookmarks = items.length === 0

            return (
                <EmptyState
                    icon={Bookmark}
                    title={hasNoBookmarks ? 'No bookmarks yet' : 'No bookmarks match'}
                    description={
                        hasNoBookmarks
                            ? 'Save diagrams and questions to find them here.'
                            : 'Try another folder, type or search term.'
                    }
                >
                    {hasNoBookmarks && (
                        <Button to="/diagrams" variant="soft">
                            Explore Diagrams
                        </Button>
                    )}
                </EmptyState>
            )
        }

        return (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => (
                    <li key={item.id}>
                        <BookmarkCard
                            item={item}
                            folders={folders}
                            onRemove={handleRemove}
                            onMove={handleMove}
                        />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <>
            <PageHeader
                icon={Bookmark}
                title="My"
                highlight="Bookmarks"
                subtitle="All your saved diagrams, notes, questions and tests in one place."
            >
                <FeatureChecklist
                    items={[
                        'Quickly access your saved content',
                        'Organize with custom folders',
                        'Continue learning anytime',
                    ]}
                />
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <Tabs tabs={typeTabs} activeTab={typeFilter} onChange={setTypeFilter} />

                <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
                    <FolderSidebar
                        folders={folders}
                        items={items}
                        activeFolder={activeFolder}
                        onSelect={setActiveFolder}
                        onCreate={addFolder}
                    />

                    <Card className="space-y-4 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="flex items-center gap-2 text-xl font-extrabold">
                                <Bookmark className="text-brand-purple size-6" />
                                Saved Items ({visibleItems.length})
                            </h2>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="rounded-pill border-line flex items-center gap-2 border bg-white px-4 py-2">
                                    <Search className="size-4 shrink-0" />
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(event) => updateQuery(event.target.value)}
                                        placeholder="Search in bookmarks..."
                                        aria-label="Search in bookmarks"
                                        className="w-40 bg-transparent text-sm outline-none"
                                    />
                                </div>
                                <SelectField
                                    id="bookmark-sort"
                                    value={sort}
                                    onChange={setSort}
                                    options={bookmarkSortOptions}
                                />
                                {items.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={() => setIsClearOpen(true)}>
                                        <Trash2 className="size-4" />
                                        Clear all
                                    </Button>
                                )}
                            </div>
                        </div>

                        {renderItems()}
                    </Card>
                </div>
            </div>

            <ConfirmModal
                isOpen={isClearOpen}
                title="Remove all bookmarks?"
                message="Every saved item will be removed. This cannot be undone."
                confirmLabel="Remove all"
                onConfirm={handleClear}
                onCancel={() => setIsClearOpen(false)}
            />
        </>
    )
}

export default Bookmarks