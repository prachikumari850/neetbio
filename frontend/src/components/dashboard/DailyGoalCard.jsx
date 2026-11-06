import { useState } from 'react'
import { Calendar, Check } from 'lucide-react'
import AssetImage from '@/components/common/AssetImage'
import ProgressBar from '@/components/common/ProgressBar'
import SectionCard from '@/components/common/SectionCard'
import { initialDailyTasks } from '@/data/mockDashboard'
import { cx } from '@/utils/classNames'

function DailyGoalCard({ className }) {
    const [tasks, setTasks] = useState(initialDailyTasks)

    const completedCount = tasks.filter((task) => task.done).length

    const toggleTask = (taskId) => {
        setTasks((current) =>
            current.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task,
            ),
        )
    }

    return (
        <SectionCard
            icon={Calendar}
            title="Daily Goal"
            iconClassName="text-danger"
            meta={`${completedCount} / ${tasks.length} Tasks`}
            className={cx('relative overflow-hidden', className)}
        >
            <ProgressBar value={(completedCount / tasks.length) * 100} />

            <ul className="mt-4 space-y-3">
                {tasks.map(({ id, label, done }) => (
                    <li key={id}>
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={done}
                            onClick={() => toggleTask(id)}
                            className="flex items-center gap-3 text-sm font-semibold"
                        >
                            <span
                                className={cx(
                                    'flex size-6 items-center justify-center rounded-full border-2',
                                    done ? 'bg-success border-success text-white' : 'border-ink-500/40',
                                )}
                            >
                                {done && <Check className="size-4" strokeWidth={3} />}
                            </span>
                            {label}
                        </button>
                    </li>
                ))}
            </ul>

            <AssetImage
                src="/images/dashboard/goal-target.png"
                className="pointer-events-none mt-2 ml-auto h-24 object-contain"
            />
        </SectionCard>
    )
}

export default DailyGoalCard