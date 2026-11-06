import { cx } from '@/utils/classNames'

const fillClasses = {
    success: 'bg-success',
    info: 'bg-info',
    purple: 'bg-brand-purple',
    orange: 'bg-brand-orange',
}

function ProgressBar({ value, tone = 'success', className }) {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
        <div
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cx(
                'bg-line rounded-pill h-2.5 w-full overflow-hidden',
                className,
            )}
        >
            <div
                className={cx('rounded-pill h-full', fillClasses[tone])}
                style={{ width: `${clampedValue}%` }}
            />
        </div>
    )
}

export default ProgressBar