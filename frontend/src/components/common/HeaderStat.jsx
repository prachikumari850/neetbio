import { cx } from '@/utils/classNames'

function HeaderStat({ icon: Icon, value, label, iconClassName }) {
    return (
        <div className="rounded-card shadow-card flex min-w-28 flex-col items-center bg-white/90 px-4 py-3 text-center">
            <Icon className={cx('size-7', iconClassName)} />
            <span className="mt-1 text-xl leading-tight font-extrabold">{value}</span>
            <span className="text-ink-700 text-xs font-medium">{label}</span>
        </div>
    )
}

export default HeaderStat