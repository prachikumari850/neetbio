import { ChartColumn } from 'lucide-react'
import ProgressRing from '@/components/common/ProgressRing'
import SectionCard from '@/components/common/SectionCard'
import { learningProgress } from '@/data/mockDashboard'
import { cx } from '@/utils/classNames'

function LearningProgressCard({ className }) {
    return (
        <SectionCard icon={ChartColumn} title="Your Learning Progress" className={className}>
            <div className="flex flex-wrap items-center gap-6">
                <ProgressRing value={learningProgress.overall}>
                    <span className="text-3xl font-extrabold">{learningProgress.overall}%</span>
                    <span className="text-ink-700 text-xs">Overall Progress</span>
                </ProgressRing>

                <ul className="min-w-48 flex-1 divide-y divide-line">
                    {learningProgress.stats.map(({ id, label, value, icon: Icon, tone }) => (
                        <li key={id} className="flex items-center gap-3 py-2.5 text-sm">
                            <Icon className={cx('size-5 shrink-0', tone)} />
                            <span className="flex-1 font-medium">{label}</span>
                            <span className="font-bold">{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </SectionCard>
    )
}

export default LearningProgressCard