import { cx } from '@/utils/classNames'

function Card({ as: Component = 'section', className, children, ...props }) {
    return (
        <Component
            className={cx(
                'rounded-card border-line bg-surface shadow-card border',
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    )
}

export default Card