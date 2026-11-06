import { cx } from '@/utils/classNames'

function AuthField({
    id,
    label,
    icon: Icon,
    outerIcon: OuterIcon,
    error,
    trailing,
    ...inputProps
}) {
    return (
        <div className="flex items-start gap-3">
            {OuterIcon && (
                <span className="text-ink-900 mt-8 hidden w-8 shrink-0 sm:block">
                    <OuterIcon className="size-6" />
                </span>
            )}

            <div className="min-w-0 flex-1">
                <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
                    {label}
                </label>
                <div
                    className={cx(
                        'rounded-pill shadow-card focus-within:ring-brand-purple/40 flex items-center gap-3 border bg-white px-4 py-3 focus-within:ring-2',
                        error ? 'border-danger' : 'border-line',
                    )}
                >
                    <Icon className="text-brand-purple size-5 shrink-0" />
                    <input
                        id={id}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className="placeholder:text-ink-500 min-w-0 flex-1 bg-transparent text-sm outline-none"
                        {...inputProps}
                    />
                    {trailing}
                </div>
                {error && (
                    <p
                        id={`${id}-error`}
                        role="alert"
                        className="text-danger mt-1 px-4 text-xs font-medium"
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}

export default AuthField