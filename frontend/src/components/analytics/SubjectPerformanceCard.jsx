import { ChartColumn } from 'lucide-react'
import Badge from '@/components/common/Badge'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { subjectPerformance } from '@/data/mockAnalytics'
import { cx } from '@/utils/classNames'

function SubjectPerformanceCard({ className }) {
    return (
        <SectionCard icon={ChartColumn} title="Subject Wise Performance" className={className}>
            <div className="text-ink-700 mb-2 grid grid-cols-[1fr_1fr_3rem_3.5rem] gap-3 text-xs font-semibold sm:grid-cols-[1.4fr_1fr_3rem_3.5rem]">
                <span>Subject</span>
                <span>Progress</span>
                <span />
                <span>Accuracy</span>
            </div>
            <ul className="space-y-3">
                {subjectPerformance.map(({ id, label, icon: Icon, tone, progress, accuracy }) => (
                    <li
                        key={id}
                        className="grid grid-cols-[1fr_1fr_3rem_3.5rem] items-center gap-3 text-sm sm:grid-cols-[1.4fr_1fr_3rem_3.5rem]"
                    >
                        <span className="flex items-center gap-2 font-semibold">
                            <Icon className={cx('size-5 shrink-0', tone)} />
                            <span className="truncate">{label}</span>
                        </span>
                        <ProgressBar value={progress} />
                        <span className="font-bold">{progress}%</span>
                        <Badge tone="success" className="justify-center">
                            {accuracy}%
                        </Badge>
                    </li>
                ))}
            </ul>
        </SectionCard>
    )
}

export default SubjectPerformanceCard