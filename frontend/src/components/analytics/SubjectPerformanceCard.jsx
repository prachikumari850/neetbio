import { BookOpen, ChartColumn } from 'lucide-react'
import Badge from '@/components/common/Badge'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { practiceSubjects } from '@/data/mockPractice'
import { accuracyTone, formatAccuracy } from '@/utils/analyticsFormat'
import { cx } from '@/utils/classNames'

const rowClasses =
    'grid grid-cols-[1fr_1fr_3rem_3.5rem] items-center gap-3 sm:grid-cols-[1.4fr_1fr_3rem_3.5rem]'

function SubjectPerformanceCard({ areas, className }) {
    return (
        <SectionCard icon={ChartColumn} title="Subject Wise Performance" className={className}>
            <div className={cx(rowClasses, 'text-ink-700 mb-2 text-xs font-semibold')}>
                <span>Subject</span>
                <span>Progress</span>
                <span />
                <span>Accuracy</span>
            </div>
            <ul className="space-y-3">
                {areas.map(({ id, label, progress, accuracy }) => {
                    const visual = practiceSubjects.find((subject) => subject.id === id)
                    const Icon = visual?.icon ?? BookOpen

                    return (
                        <li key={id} className={cx(rowClasses, 'text-sm')}>
                            <span className="flex items-center gap-2 font-semibold">
                                <Icon className={cx('size-5 shrink-0', visual?.iconTone)} />
                                <span className="truncate">{label}</span>
                            </span>
                            <ProgressBar value={progress} />
                            <span className="font-bold">{progress}%</span>
                            <Badge tone={accuracyTone(accuracy)} className="justify-center">
                                {formatAccuracy(accuracy)}
                            </Badge>
                        </li>
                    )
                })}
            </ul>
        </SectionCard>
    )
}

export default SubjectPerformanceCard