import { History } from 'lucide-react'
import SectionCard from '@/components/common/SectionCard'
import { dashboardActivity } from '@/data/mockDashboard'
import { cx } from '@/utils/classNames'

function RecentActivityCard() {
    return (
        <SectionCard
            icon={History}
            title="Recent Activity"
            iconClassName="text-success"
            action={{ label: 'View All', to: '/my-learning' }}
        >
            <ul className="divide-line divide-y">
                {dashboardActivity.map(({ id, label, time, icon: Icon, tone }) => (
                    <li key={id} className="flex items-center gap-3 py-2.5 text-sm">
                        <Icon className={cx('size-5 shrink-0', tone)} />
                        <span className="flex-1 font-medium">{label}</span>
                        <span className="text-ink-500 shrink-0 text-xs">{time}</span>
                    </li>
                ))}
            </ul>
        </SectionCard>
    )
}

export default RecentActivityCard