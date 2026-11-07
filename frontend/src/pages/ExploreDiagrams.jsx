import { useState } from 'react'
import { ArrowUpDown, BookOpen, Layers, LayoutGrid, List, Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import FeatureChecklist from '@/components/common/FeatureChecklist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Modal from '@/components/common/Modal'
import PageHeader from '@/components/common/PageHeader'
import Pagination from '@/components/common/Pagination'
import SelectField from '@/components/common/SelectField'
import Tabs from '@/components/common/Tabs'
import DiagramCard from '@/components/diagrams/DiagramCard'
import DiagramFilters from '@/components/diagrams/DiagramFilters'
import DiagramViewer from '@/components/diagrams/DiagramViewer'
import { diagramSortOptions } from '@/data/diagramOptions'
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'
import { useDiagram } from '@/hooks/useDiagram'
import { useDiagramFacets } from '@/hooks/useDiagramFacets'
import { useDiagramSearch } from '@/hooks/useDiagramSearch'
import { cx } from '@/utils/classNames'
import { diagramToBookmark } from '@/utils/bookmarkItems'

const PAGE_SIZE = 8

const classTabs = [
    { id: '11', label: 'Class 11' },
    { id: '12', label: 'Class 12' },
    { id: 'all', label: 'All' },
]

const initialFilters = {
    classLevel: '11',
    chapter: 'all',
    topic: 'all',
    sort: 'relevant',
    types: [],
    features: [],
}

const layoutButtonClasses = 'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold'

function toOptions(allLabel, values) {
    return [
        { value: 'all', label: allLabel },
        ...values.map((value) => ({ value, label: value })),
    ]
}

function matchesClass(item, classLevel) {
    return classLevel === 'all' || item.classLevel === classLevel
}

function ExploreDiagrams() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(initialFilters)
    const [pageState, setPageState] = useState({ query: '', page: 1 })
    const [layout, setLayout] = useState('grid')
    const { isBookmarked, toggle } = useBookmarkToggle()
    const facets = useDiagramFacets()

    const query = searchParams.get('q') ?? ''
    const isSearching = query.trim() !== ''
    const effectiveClassLevel = isSearching ? 'all' : filters.classLevel
    const openId = searchParams.get('open')
    const { diagram: openDiagram, isLoading: isOpening } = useDiagram(openId)

    const page = pageState.query === query ? pageState.page : 1
    const setPage = (nextPage) => setPageState({ query, page: nextPage })

    const { items, total, totalPages, isLoading, error, retry } = useDiagramSearch({
        query,
        classLevel: effectiveClassLevel,
        chapter: filters.chapter,
        topic: filters.topic,
        types: filters.types,
        features: filters.features,
        sort: filters.sort,
        page,
        pageSize: PAGE_SIZE,
    })

    const updateParam = (key, value) => {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous)
            if (value) {
                next.set(key, value)
            } else {
                next.delete(key)
            }
            return next
        })
    }

    const updateFilters = (patch) => {
        setFilters((current) => ({ ...current, ...patch }))
        setPage(1)
    }

    const handleClassChange = (classLevel) => {
        updateParam('q', '')
        updateFilters({ classLevel, chapter: 'all', topic: 'all' })
    }

    const toggleFilterValue = (group, id) => {
        const current = filters[group]
        updateFilters({
            [group]: current.includes(id)
                ? current.filter((value) => value !== id)
                : [...current, id],
        })
    }

    const resetFilters = () => {
        setFilters(initialFilters)
        setPage(1)
        updateParam('q', '')
    }

    const chapters = facets.chapters
        .filter((chapter) => matchesClass(chapter, effectiveClassLevel))
        .map((chapter) => chapter.name)
    const topics = [
        ...new Set(
            facets.topics
                .filter(
                    (topic) =>
                        matchesClass(topic, effectiveClassLevel) &&
                        (filters.chapter === 'all' || topic.chapter === filters.chapter),
                )
                .map((topic) => topic.name),
        ),
    ]

    const renderResults = () => {
        if (error) {
            return (
                <EmptyState icon={Search} title="Couldn’t load diagrams" description={error}>
                    <Button variant="soft" onClick={retry}>
                        Try again
                    </Button>
                </EmptyState>
            )
        }

        if (isLoading && items.length === 0) {
            return <LoadingSpinner label="Loading diagrams..." />
        }

        if (items.length === 0) {
            return (
                <EmptyState
                    icon={Search}
                    title="No diagrams match your filters"
                    description="Try a different search term or reset the filters."
                >
                    <Button variant="soft" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </EmptyState>
            )
        }

        return (
            <ul
                aria-busy={isLoading}
                className={cx(
                    'grid gap-4',
                    layout === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1',
                    isLoading && 'opacity-60',
                )}
            >
                {items.map((diagram) => (
                    <li key={diagram.id}>
                        <DiagramCard
                            diagram={diagram}
                            layout={layout}
                            isBookmarked={isBookmarked(`diagram-${diagram.id}`)}
                            onToggleBookmark={(item) => toggle(diagramToBookmark(item))}
                            onOpen={(id) => updateParam('open', id)}
                        />
                    </li>
                ))}
            </ul>
        )
    }

    const isResultsCardVisible = error || items.length === 0

    return (
        <>
            <PageHeader
                title="Explore"
                highlight="Biology Diagrams"
                subtitle="A complete collection of NEET-focused, interactive diagrams for Class 11 & 12 Biology."
            >
                <FeatureChecklist
                    items={['Interactive & Labeled', 'Click to Learn Functions', 'Practice Identification', 'NEET Focused']}
                />
            </PageHeader>

            <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end gap-4">
                    <Tabs tabs={classTabs} activeTab={effectiveClassLevel} onChange={handleClassChange} />
                    <SelectField
                        id="chapter"
                        label="Select Chapter"
                        icon={BookOpen}
                        value={filters.chapter}
                        onChange={(chapter) => updateFilters({ chapter, topic: 'all' })}
                        options={toOptions('All Chapters', chapters)}
                        className="min-w-52 flex-1"
                    />
                    <SelectField
                        id="topic"
                        label="Select Topic"
                        icon={Layers}
                        value={filters.topic}
                        onChange={(topic) => updateFilters({ topic })}
                        options={toOptions('All Topics', topics)}
                        className="min-w-52 flex-1"
                    />
                    <SelectField
                        id="sort"
                        label="Sort By"
                        icon={ArrowUpDown}
                        value={filters.sort}
                        onChange={(sort) => updateFilters({ sort })}
                        options={diagramSortOptions}
                        className="min-w-44 flex-1"
                    />
                </div>

                <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
                    <DiagramFilters
                        filters={filters}
                        facets={facets}
                        onToggle={toggleFilterValue}
                        onReset={resetFilters}
                    />

                    <section className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="flex items-center gap-2 text-xl font-extrabold">
                                <BookOpen className="text-brand-orange size-6" />
                                {total} Diagrams Found
                            </h2>

                            {isSearching && (
                                <button
                                    type="button"
                                    onClick={() => updateParam('q', '')}
                                    className="bg-brand-purple-soft text-brand-purple flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                                >
                                    <Search className="size-4" />“{query}”
                                    <X className="size-4" />
                                </button>
                            )}

                            <div className="rounded-pill bg-brand-purple-soft flex p-1">
                                <button
                                    type="button"
                                    aria-pressed={layout === 'grid'}
                                    onClick={() => setLayout('grid')}
                                    className={cx(layoutButtonClasses, layout === 'grid' && 'bg-action-purple text-white')}
                                >
                                    <LayoutGrid className="size-4" />
                                    Grid
                                </button>
                                <button
                                    type="button"
                                    aria-pressed={layout === 'list'}
                                    onClick={() => setLayout('list')}
                                    className={cx(layoutButtonClasses, layout === 'list' && 'bg-action-purple text-white')}
                                >
                                    <List className="size-4" />
                                    List
                                </button>
                            </div>
                        </div>

                        {isResultsCardVisible ? (
                            <div className="rounded-card border-line shadow-card border bg-white">
                                {renderResults()}
                            </div>
                        ) : (
                            renderResults()
                        )}

                        <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
                    </section>
                </div>
            </div>

            {openDiagram && (
                <DiagramViewer
                    key={openDiagram.id}
                    diagram={openDiagram}
                    onClose={() => updateParam('open', '')}
                />
            )}

            {openId && !isOpening && !openDiagram && (
                <Modal isOpen title="Diagram not found" onClose={() => updateParam('open', '')}>
                    <p className="text-ink-700 text-sm">
                        This diagram doesn’t exist or couldn’t be loaded right now.
                    </p>
                </Modal>
            )}
        </>
    )
}

export default ExploreDiagrams