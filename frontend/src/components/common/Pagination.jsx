import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '@/utils/classNames'

function getPageItems(totalPages, currentPage) {
    if (totalPages <= 6) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const windowStart = Math.min(Math.max(currentPage - 1, 2), totalPages - 3)
    const middlePages = [windowStart, windowStart + 1, windowStart + 2]

    return [1, ...middlePages, 'ellipsis', totalPages].filter(
        (item, index, items) => items.indexOf(item) === index,
    )
}

const arrowClasses =
    'flex size-9 items-center justify-center rounded-full hover:bg-brand-purple-soft disabled:opacity-40'

function Pagination({ currentPage, totalPages, onChange }) {
    if (totalPages <= 1) {
        return null
    }

    return (
        <nav
            aria-label="Pagination"
            className="rounded-pill shadow-card border-line mx-auto flex w-fit items-center gap-1 border bg-white px-2 py-1.5"
        >
            <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className={arrowClasses}
            >
                <ChevronLeft className="size-5" />
            </button>

            {getPageItems(totalPages, currentPage).map((item, index) =>
                item === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === currentPage ? 'page' : undefined}
                        onClick={() => onChange(item)}
                        className={cx(
                            'size-9 rounded-full text-sm font-semibold',
                            item === currentPage
                                ? 'bg-action-orange text-white'
                                : 'hover:bg-brand-purple-soft',
                        )}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => onChange(currentPage + 1)}
                className={arrowClasses}
            >
                <ChevronRight className="size-5" />
            </button>
        </nav>
    )
}

export default Pagination