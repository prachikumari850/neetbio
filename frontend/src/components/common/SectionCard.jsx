import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '@/components/common/Card'
import { cx } from '@/utils/classNames'

const actionClasses =
    'text-brand-orange flex shrink-0 items-center gap-1 text-sm font-bold hover:underline'

function SectionAction({ action }) {
    const content = (
        <>
            {action.label}
            <ArrowRight className="size-4" />
        </>
    )

    if (action.to) {
        return (
            <Link to={action.to} className={actionClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button type="button" onClick={action.onClick} className={actionClasses}>
            {content}
        </button>
    )
}

function SectionCard({
    icon: Icon,
    title,
    iconClassName = 'text-brand-purple',
    action,
    meta,
    className,
    children,
}) {
    return (
        <Card className={cx('p-5', className)}>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
                    {Icon && <Icon className={cx('size-6 shrink-0', iconClassName)} />}
                    {title}
                </h2>
                {meta && (
                    <span className="text-ink-700 shrink-0 text-sm font-medium">{meta}</span>
                )}
                {action && <SectionAction action={action} />}
            </div>
            {children}
        </Card>
    )
}

export default SectionCard