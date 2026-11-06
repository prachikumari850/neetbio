import { cx } from '@/utils/classNames'

function SegmentedTabs({ tabs, activeTab, onChange, className }) {
    return (
        <div role="tablist" className={cx('flex flex-wrap gap-2', className)}>
            {tabs.map(({ id, label }) => {
                const isActive = id === activeTab

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(id)}
                        className={cx(
                            'rounded-pill border px-5 py-1.5 text-sm font-semibold transition',
                            isActive
                                ? 'bg-action-orange shadow-raised border-transparent text-white'
                                : 'border-line text-ink-700 hover:bg-brand-orange-soft bg-white',
                        )}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
    )
}

export default SegmentedTabs