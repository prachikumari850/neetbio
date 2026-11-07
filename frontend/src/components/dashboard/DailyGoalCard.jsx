import { useState } from 'react'
import { Calendar, Check } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import SummaryGate from '@/components/common/SummaryGate'
import EditGoalsModal from '@/components/dashboard/EditGoalsModal'
import { useLearningStore } from '@/store/useLearningStore'
import { cx } from '@/utils/classNames'

function DailyGoalCard({ className }) {
    const [isEditing, setIsEditing] = useState(false)
    const goals = useLearningStore((state) => state.summary?.goals)

    return (
        <SectionCard
            icon={Calendar}
            title="Daily Goal"
            iconClassName="text-danger"
            meta={goals ? `${goals.completed} / ${goals.total} Tasks` : undefined}
            action={goals ? { label: 'Edit', onClick: () => setIsEditing(true) } : undefined}
            className={cx('relative overflow-hidden', className)}
        >
            <SummaryGate>
                {({ goals: summaryGoals }) => (
                    <>
                        <ProgressBar value={(summaryGoals.completed / summaryGoals.total) * 100} />

                        <ul className="mt-4 space-y-3">
                            {summaryGoals.items.map(({ id, label, target, progress, done }) => (
                                <li key={id} className="flex items-center gap-3 text-sm font-semibold">
                                    <span
                                        className={cx(
                                            'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                                            done ? 'bg-success border-success text-white' : 'border-ink-500/40',
                                        )}
                                    >
                                        {done && <Check className="size-4" strokeWidth={3} />}
                                    </span>
                                    <span className="flex-1">{label}</span>
                                    <span className="text-ink-500 text-xs">
                                        {Math.min(progress, target)}/{target}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </SummaryGate>

            <AssetImage
                src="/images/dashboard/goal-target.png"
                className="pointer-events-none mt-2 ml-auto h-24 object-contain"
            />

            {goals && (
                <EditGoalsModal
                    isOpen={isEditing}
                    targets={goals.targets}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </SectionCard>
    )
}

export default DailyGoalCard