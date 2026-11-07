import { Bookmark, Microscope } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import Badge from '@/components/common/Badge'
import { cx } from '@/utils/classNames'
import { getDiagramBadges } from '@/utils/diagramBadges'

function DiagramCard({ diagram, layout, isBookmarked, onToggleBookmark, onOpen }) {
    const isList = layout === 'list'

    return (
        <article className="rounded-card border-line shadow-card hover:shadow-raised relative border bg-white transition hover:-translate-y-0.5">
            <button
                type="button"
                onClick={() => onOpen(diagram.id)}
                className={cx(
                    'flex w-full gap-3 p-4 text-left',
                    isList ? 'items-center pr-14' : 'flex-col items-center text-center',
                )}
            >
                <span
                    className={cx(
                        'flex items-center justify-center',
                        isList ? 'h-20 w-28 shrink-0' : 'h-28 w-full',
                    )}
                >
                    <AssetImage
                        src={diagram.image}
                        alt=""
                        className="max-h-full object-contain"
                        fallback={<Microscope className="text-brand-purple/40 size-14" />}
                    />
                </span>
                <span className="min-w-0">
                    <span className="block text-base font-extrabold">{diagram.title}</span>
                    <span className="text-ink-500 block text-xs">{diagram.topic}</span>
                    <span className={cx('mt-2 flex flex-wrap gap-1.5', !isList && 'justify-center')}>
                        {getDiagramBadges(diagram).map(({ label, tone }) => (
                            <Badge key={label} tone={tone}>
                                {label}
                            </Badge>
                        ))}
                    </span>
                </span>
            </button>

            <button
                type="button"
                aria-label={isBookmarked ? `Remove ${diagram.title} bookmark` : `Bookmark ${diagram.title}`}
                aria-pressed={isBookmarked}
                onClick={() => onToggleBookmark(diagram)}
                className="hover:bg-brand-purple-soft absolute top-3 right-3 rounded-full p-1.5"
            >
                <Bookmark
                    className={cx(
                        'size-5',
                        isBookmarked && 'fill-brand-orange text-brand-orange',
                    )}
                />
            </button>
        </article>
    )
}

export default DiagramCard