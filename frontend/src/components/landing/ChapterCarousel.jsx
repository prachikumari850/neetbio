import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import LandingSection from '@/components/landing/LandingSection'
import SegmentedTabs from '@/components/landing/SegmentedTabs'
import { chapterClassTabs, diagramChapters } from '@/data/landingContent'

const SCROLL_DISTANCE = 300

const arrowButtonClasses =
    'border-line shadow-card hover:bg-brand-purple-soft absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white'

function ChapterCarousel() {
    const [activeClass, setActiveClass] = useState('11')
    const trackRef = useRef(null)

    const visibleChapters =
        activeClass === 'all'
            ? diagramChapters
            : diagramChapters.filter((chapter) => chapter.classLevel === activeClass)

    const handleTabChange = (classId) => {
        setActiveClass(classId)
        trackRef.current?.scrollTo({ left: 0 })
    }

    const scrollTrack = (direction) => {
        trackRef.current?.scrollBy({
            left: direction * SCROLL_DISTANCE,
            behavior: 'smooth',
        })
    }

    return (
        <LandingSection>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 text-2xl font-extrabold">
                    <BookOpen className="text-brand-purple size-8" />
                    Explore Diagrams by Chapter
                </h2>
                <Link
                    to="/diagrams"
                    className="text-brand-orange flex items-center gap-1 text-sm font-bold"
                >
                    View All Diagrams
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            <SegmentedTabs
                tabs={chapterClassTabs}
                activeTab={activeClass}
                onChange={handleTabChange}
                className="mt-4"
            />

            <div className="relative mt-5">
                <button
                    type="button"
                    aria-label="Scroll chapters left"
                    onClick={() => scrollTrack(-1)}
                    className={`${arrowButtonClasses} -left-3`}
                >
                    <ChevronLeft className="size-5" />
                </button>

                <ul
                    ref={trackRef}
                    className="flex gap-4 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {visibleChapters.map(
                        ({ id, title, diagramCount, image, icon: Icon }) => (
                            <li key={id} className="w-40 shrink-0">
                                <Link
                                    to={`/diagrams?q=${encodeURIComponent(title)}`}
                                    className="border-line shadow-card flex h-full flex-col items-center gap-2 rounded-2xl border bg-white p-3 text-center transition hover:-translate-y-0.5"
                                >
                                    <span className="flex h-24 w-full items-center justify-center">
                                        <AssetImage
                                            src={image}
                                            alt=""
                                            className="max-h-full object-contain"
                                            fallback={<Icon className="text-brand-purple size-14" />}
                                        />
                                    </span>
                                    <span className="text-sm leading-tight font-bold">{title}</span>
                                    <span className="text-ink-500 text-xs">
                                        {diagramCount} Diagrams
                                    </span>
                                </Link>
                            </li>
                        ),
                    )}
                </ul>

                <button
                    type="button"
                    aria-label="Scroll chapters right"
                    onClick={() => scrollTrack(1)}
                    className={`${arrowButtonClasses} -right-3`}
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </LandingSection>
    )
}

export default ChapterCarousel