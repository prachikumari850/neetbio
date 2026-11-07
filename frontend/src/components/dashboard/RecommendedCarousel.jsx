import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Microscope, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import SectionCard from '@/components/common/SectionCard'
import SummaryGate from '@/components/common/SummaryGate'
import { useBookmarkToggle } from '@/hooks/useBookmarkToggle'
import { cx } from '@/utils/classNames'
import { diagramToBookmark } from '@/utils/bookmarkItems'

const PAGE_SIZE = 4

const arrowClasses =
    'border-line shadow-card hover:bg-brand-purple-soft flex size-9 shrink-0 items-center justify-center rounded-full border bg-white'

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
                                    title={diagram.reason}
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
                                    <span className="text-ink-500 text-[11px] leading-tight">{diagram.reason}</span>
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
    return (
        <SectionCard
            icon={Star}
            title="Recommended for You"
            iconClassName="fill-brand-orange text-brand-orange"
            action={{ label: 'View All', to: '/diagrams' }}
            className={className}
        >
            <SummaryGate>
                {({ recommendations }) =>
                    recommendations.diagrams.length === 0 ? (
                        <p className="text-ink-500 py-6 text-center text-sm">
                            No recommendations yet. Explore a few diagrams and take a test.
                        </p>
                    ) : (
                        <DiagramPager diagrams={recommendations.diagrams} />
                    )
                }
            </SummaryGate>
        </SectionCard>
    )
}

export default RecommendedCarousel