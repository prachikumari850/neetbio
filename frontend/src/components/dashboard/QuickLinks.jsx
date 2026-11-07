import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardLinks } from '@/data/learningConfig'
import { cx } from '@/utils/classNames'

function QuickLinks() {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardLinks.map(({ id, title, subtitle, to, icon: Icon, tint, iconTone }) => (
                <li key={id}>
                    <Link
                        to={to}
                        className={cx(
                            'rounded-card shadow-card flex items-center gap-4 px-5 py-4 font-bold transition hover:-translate-y-0.5',
                            tint,
                        )}
                    >
                        <Icon className={cx('size-10 shrink-0', iconTone)} />
                        <span className="flex-1 leading-tight">
                            {title}
                            {subtitle && <span className="block font-medium">{subtitle}</span>}
                        </span>
                        <ArrowRight className="size-5 shrink-0" />
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default QuickLinks