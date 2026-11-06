import { cx } from '@/utils/classNames'

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={cx(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                checked ? 'bg-success' : 'bg-ink-500/30',
            )}
        >
            <span
                className={cx(
                    'absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform',
                    checked && 'translate-x-5',
                )}
            />
        </button>
    )
}

export default Toggle