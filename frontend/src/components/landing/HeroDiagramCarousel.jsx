import { useState } from 'react'
import { Bot, ChevronLeft, ChevronRight, Leaf, MousePointerClick } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssetImage from '@/components/common/AssetImage'
import { heroSlides } from '@/data/landingContent'
import { cx } from '@/utils/classNames'

const arrowButtonClasses =
    'border-line shadow-card hover:bg-brand-purple-soft flex size-9 items-center justify-center rounded-full border bg-white'

function HeroDiagramCarousel() {
    const [slideIndex, setSlideIndex] = useState(0)
    const [activeLabelId, setActiveLabelId] = useState(null)

    const slide = heroSlides[slideIndex]
    const activeLabel = slide.labels.find((label) => label.id === activeLabelId)

    const goToSlide = (index) => {
        setSlideIndex((index + heroSlides.length) % heroSlides.length)
        setActiveLabelId(null)
    }

    return (
        <div>
            <div className="relative mx-auto aspect-square max-w-md">
                <AssetImage
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-contain"
                    fallback={
                        <div className="flex size-full items-center justify-center">
                            <Leaf className="text-success/40 size-32" />
                        </div>
                    }
                />
                {slide.labels.map((label) => (
                    <button
                        key={label.id}
                        type="button"
                        aria-pressed={label.id === activeLabelId}
                        onClick={() => setActiveLabelId(label.id)}
                        style={{
                            top: label.top,
                            '--label-left': label.left,
                            '--label-left-mobile': label.mobileLeft ?? `calc(${label.left} - 12%)`,
                        }}
                        className={cx(
                            'rounded-pill shadow-card absolute left-[var(--label-left)] flex -translate-y-1/2 items-center gap-2 bg-white px-3 py-1 text-xs font-bold max-sm:left-[var(--label-left-mobile)] max-sm:gap-1 max-sm:px-1 max-sm:text-[9px]',
                            label.id === activeLabelId && 'ring-brand-purple ring-2',
                        )}
                    >
                        <span className={cx('size-2.5 rounded-full', label.dot)} />
                        {label.name}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 lg:-mt-6">
                <div className="shadow-card flex max-w-60 items-center gap-3 rounded-2xl bg-white px-4 py-3">
                    <MousePointerClick className="text-brand-orange size-6 shrink-0" />
                    <div>
                        <p className="text-sm font-bold">
                            {activeLabel ? activeLabel.name : slide.title}
                        </p>
                        <p className="text-ink-500 text-xs">
                            {activeLabel ? activeLabel.description : slide.hint}
                        </p>
                    </div>
                </div>

                <Link
                    to="/ai-learn"
                    className="shadow-card flex max-w-64 items-center gap-3 rounded-2xl bg-white px-4 py-3"
                >
                    <AssetImage
                        src="/images/landing/ai-robot.png"
                        className="h-12 object-contain"
                        fallback={<Bot className="text-brand-purple size-9 shrink-0" />}
                    />
                    <p className="text-xs">
                        <span className="text-brand-orange block font-bold">Powered by AI</span>
                        Chat, analyze or generate any Biology diagram instantly.
                    </p>
                </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
                <button
                    type="button"
                    aria-label="Previous diagram"
                    onClick={() => goToSlide(slideIndex - 1)}
                    className={arrowButtonClasses}
                >
                    <ChevronLeft className="size-5" />
                </button>
                <div className="flex gap-2">
                    {heroSlides.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            aria-label={`Show ${item.title}`}
                            aria-current={index === slideIndex}
                            onClick={() => goToSlide(index)}
                            className={cx(
                                'size-2.5 rounded-full',
                                index === slideIndex ? 'bg-brand-orange' : 'bg-ink-500/30',
                            )}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    aria-label="Next diagram"
                    onClick={() => goToSlide(slideIndex + 1)}
                    className={arrowButtonClasses}
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    )
}

export default HeroDiagramCarousel
