import { cx } from '@/utils/classNames'

const containerClasses = {
    joined: 'rounded-pill bg-white/80 p-1.5 shadow-card',
    separate: 'gap-3',
}

const activeClasses = 'bg-action-purple text-white shadow-raised'

const inactiveClasses = {
    joined: 'text-ink-700 hover:bg-brand-purple-soft',
    separate: 'bg-white text-ink-900 shadow-card hover:bg-brand-purple-soft',
}

function Tabs({
    tabs,
    activeTab,
    onChange,
    variant = 'joined',
    className,
}) {
    return (
        <div
            role="tablist"
            className={cx(
                'flex gap-2 overflow-x-auto',
                containerClasses[variant],
                className,
            )}
        >
            {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = id === activeTab

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(id)}
                        className={cx(
                            'rounded-pill flex shrink-0 items-center gap-2 px-5 py-2.5 text-sm font-semibold transition',
                            isActive ? activeClasses : inactiveClasses[variant],
                        )}
                    >
                        {Icon && <Icon className="size-5" />}
                        {label}
                    </button>
                )
            })}
        </div>
    )
}

export default Tabs