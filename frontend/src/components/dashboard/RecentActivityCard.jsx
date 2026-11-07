import { History } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'
import SummaryGate from '@/components/common/SummaryGate'
import { activityVisuals } from '@/data/learningConfig'
import { cx } from '@/utils/classNames'
import { formatRelativeTime } from '@/utils/formatters'

function RecentActivityCard() {
    return (
        <SectionCard
            icon={History}
            title="Recent Activity"
            iconClassName="text-success"
            action={{ label: 'View All', to: '/my-learning' }}
        >
            <SummaryGate>
                {({ activity }) =>
                    activity.length === 0 ? (
                        <p className="text-ink-500 py-2 text-sm">
                            Your tests, diagrams, notes and chats appear here.
                        </p>
                    ) : (
                        <ul className="divide-line divide-y">
                            {activity.slice(0, 3).map(({ id, kind, label, at }) => {
                                const { icon: Icon, tone } = activityVisuals[kind]

                                return (
                                    <li key={id} className="flex items-center gap-3 py-2.5 text-sm">
                                        <Icon className={cx('size-5 shrink-0', tone)} />
                                        <span className="flex-1 truncate font-medium">{label}</span>
                                        <span className="text-ink-500 shrink-0 text-xs">{formatRelativeTime(at)}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                }
            </SummaryGate>
        </SectionCard>
    )
}

export default RecentActivityCard