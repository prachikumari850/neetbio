import { cx } from '@/utils/classNames'

const toneClasses = {
    solid: 'bg-brand-purple text-white',
    success: 'bg-success-soft text-success',
    info: 'bg-info-soft text-info',
    danger: 'bg-danger-soft text-danger',
    neutral: 'bg-brand-purple-soft text-brand-purple',
}

function Badge({ tone = 'neutral', className, children }) {
    return (
        <span
            className={cx(
                'rounded-pill inline-flex items-center px-3 py-0.5 text-xs font-semibold',
                toneClasses[tone],
                className,
            )}
        >
            {children}
        </span>
    )
}

export default Badge