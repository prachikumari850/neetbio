import { cx } from '@/utils/classNames'

function LandingSection({ id, title, subtitle, className, children }) {
    return (
        <section
            id={id}
            className={cx('mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className)}
        >
            {title && (
                <div className="mb-8 text-center">
                    <h2 className="text-navy-900 text-3xl font-extrabold">{title}</h2>
                    {subtitle && <p className="text-ink-700 mt-2">{subtitle}</p>}
                </div>
            )}
            {children}
        </section>
    )
}

export default LandingSection