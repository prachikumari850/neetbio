import { Search } from 'lucide-react'
import { cx } from '@/utils/classNames'

function SearchInput({
    value,
    onChange,
    onSubmit,
    placeholder,
    inputRef,
    shortcutHint,
    className,
}) {
    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit?.(value)
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={cx(
                'rounded-pill border-line shadow-card flex items-center gap-3 border bg-white/90 px-5 py-2.5',
                className,
            )}
        >
            <Search className="text-ink-700 size-5 shrink-0" />
            <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="placeholder:text-ink-500 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
            />
            {shortcutHint && (
                <kbd className="border-line text-ink-700 bg-page hidden rounded-md border px-2 py-0.5 text-xs font-semibold sm:block">
                    {shortcutHint}
                </kbd>
            )}
        </form>
    )
}

export default SearchInput