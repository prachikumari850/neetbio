import { Link } from 'react-router-dom'
import { cx } from '@/utils/classNames'

const variantClasses = {
    orange: 'bg-action-orange text-white shadow-raised hover:brightness-105',
    purple: 'bg-action-purple text-white shadow-raised hover:brightness-105',
    outline:
        'border border-brand-purple/40 bg-white text-brand-purple hover:bg-brand-purple-soft',
    soft: 'bg-brand-purple-soft text-brand-purple hover:bg-brand-purple/20',
}

const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
}

function Button({
    variant = 'orange',
    size = 'md',
    to,
    className,
    children,
    ...props
}) {
    const classes = cx(
        'rounded-pill inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
    )

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        )
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    )
}

export default Button