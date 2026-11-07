import { BookOpen, Bot, ChartColumn, CircleCheck, Target } from 'lucide-react'
import ProgressRing from '@/components/common/ProgressRing'
import SectionCard from '@/components/common/SectionCard'
import SummaryGate from '@/components/common/SummaryGate'
import { formatAccuracy } from '@/utils/analyticsFormat'
import { cx } from '@/utils/classNames'

function buildRows(stats) {
    return [
        { id: 'chapters', label: 'Chapters Completed', value: `${stats.chaptersCompleted} / ${stats.chaptersTotal}`, icon: BookOpen, tone: 'text-success' },
        { id: 'diagrams', label: 'Diagrams Studied', value: stats.diagramsStudied, icon: Bot, tone: 'text-brand-purple' },
        { id: 'practice', label: 'Practice Attempted', value: stats.questionsAttempted.toLocaleString(), icon: Target, tone: 'text-accent-pink' },
        { id: 'accuracy', label: 'Accuracy', value: formatAccuracy(stats.accuracy), icon: CircleCheck, tone: 'text-info' },
    ]
}

function LearningProgressCard({ className }) {
    return (
        <SectionCard icon={ChartColumn} title="Your Learning Progress" className={className}>
            <SummaryGate>
                {({ stats }) => (
                    <div className="flex flex-wrap items-center gap-6">
                        <ProgressRing value={stats.progress}>
                            <span className="text-3xl font-extrabold">{stats.progress}%</span>
                            <span className="text-ink-700 text-xs">Overall Progress</span>
                        </ProgressRing>

                        <ul className="min-w-48 flex-1 divide-y divide-line">
                            {buildRows(stats).map(({ id, label, value, icon: Icon, tone }) => (
                                <li key={id} className="flex items-center gap-3 py-2.5 text-sm">
                                    <Icon className={cx('size-5 shrink-0', tone)} />
                                    <span className="flex-1 font-medium">{label}</span>
                                    <span className="font-bold">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </SummaryGate>
        </SectionCard>
    )
}

export default LearningProgressCard