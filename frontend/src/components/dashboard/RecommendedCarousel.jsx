import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Microscope, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import SectionCard from '@/components/common/SectionCard'
import { recommendedDiagramIds } from '@/data/mockDashboard'
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'
import { listDiagrams } from '@/services/diagramService'
import { cx } from '@/utils/classNames'
import { diagramToBookmark } from '@/utils/bookmarkItems'

const PAGE_SIZE = 4

const arrowClasses =
    'border-line shadow-card hover:bg-brand-purple-soft flex size-9 shrink-0 items-center justify-center rounded-full border bg-white'

function orderByRecommendation(diagrams) {
    return [...diagrams].sort(
        (a, b) => recommendedDiagramIds.indexOf(a.id) - recommendedDiagramIds.indexOf(b.id),
    )
}

function DiagramPager({ diagrams }) {
    const [page, setPage] = useState(0)
    const { isBookmarked, toggle } = useBookmarkToggle()

    const pageCount = Math.ceil(diagrams.length / PAGE_SIZE)
    const goToPage = (nextPage) => setPage((nextPage + pageCount) % pageCount)
    const visibleDiagrams = diagrams.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    return (
        <>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Previous recommendations"
                    onClick={() => goToPage(page - 1)}
                    className={arrowClasses}
                >
                    <ChevronLeft className="size-5" />
                </button>

                <ul className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                    {visibleDiagrams.map((diagram) => {
                        const saved = isBookmarked(`diagram-${diagram.id}`)

                        return (
                            <li key={diagram.id} className="relative">
                                <Link
                                    to={`/diagrams?open=${diagram.id}`}
                                    className="border-line flex h-full flex-col items-center gap-2 rounded-2xl border bg-white p-3 text-center"
                                >
                                    <span className="flex h-20 items-center justify-center">
                                        <AssetImage
                                            src={diagram.image}
                                            alt=""
                                            className="max-h-full object-contain"
                                            fallback={<Microscope className="text-brand-purple/40 size-10" />}
                                        />
                                    </span>
                                    <span className="text-sm leading-tight font-bold">{diagram.title}</span>
                                    <Badge className="max-w-full truncate text-[10px]">
                                        {diagram.chapter.split(':')[0]}
                                    </Badge>
                                </Link>
                                <button
                                    type="button"
                                    aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
                                    aria-pressed={saved}
                                    onClick={() => toggle(diagramToBookmark(diagram))}
                                    className="absolute top-2 right-2"
                                >
                                    <Heart
                                        className={cx(
                                            'size-5',
                                            saved ? 'fill-danger text-danger' : 'text-ink-500',
                                        )}
                                    />
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <button
                    type="button"
                    aria-label="Next recommendations"
                    onClick={() => goToPage(page + 1)}
                    className={arrowClasses}
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>

            <div className="mt-3 flex justify-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => (
                    <button
                        key={index}
                        type="button"
                        aria-label={`Show page ${index + 1}`}
                        aria-current={index === page}
                        onClick={() => goToPage(index)}
                        className={cx(
                            'size-2.5 rounded-full',
                            index === page ? 'bg-brand-orange' : 'bg-ink-500/30',
                        )}
                    />
                ))}
            </div>
        </>
    )
}

function RecommendedCarousel({ className }) {
    const [diagrams, setDiagrams] = useState(null)

    useEffect(() => {
        let isCancelled = false

        listDiagrams({ ids: recommendedDiagramIds, pageSize: recommendedDiagramIds.length })
            .then(({ items }) => {
                if (!isCancelled) {
                    setDiagrams(orderByRecommendation(items))
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setDiagrams([])
                }
            })

        return () => {
            isCancelled = true
        }
    }, [])

    const renderBody = () => {
        if (diagrams === null) {
            return <LoadingSpinner label="Loading recommendations..." />
        }

        if (diagrams.length === 0) {
            return (
                <p className="text-ink-500 py-6 text-center text-sm">
                    Recommendations are unavailable right now.
                </p>
            )
        }

        return <DiagramPager diagrams={diagrams} />
    }

    return (
        <SectionCard
            icon={Star}
            title="Recommended for You"
            iconClassName="fill-brand-orange text-brand-orange"
            action={{ label: 'View All', to: '/diagrams' }}
            className={className}
        >
            {renderBody()}
        </SectionCard>
    )
}

export default RecommendedCarousel