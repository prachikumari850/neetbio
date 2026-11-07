import { ChartColumn, CircleCheck, CircleX, Clock, Target } from 'lucide-react'
import ProgressRing from '@/components/common/ProgressRing'
import SectionCard from '@/components/common/SectionCard'
import { useTestStore } from '@/store/useTestStore'

const emptyStats = { accuracy: 0, attempted: 0, correct: 0, wrong: 0, testsCompleted: 0 }

function TestProgressCard() {
    const stats = useTestStore((state) => state.stats) ?? emptyStats

    const rows = [
        { id: 'attempted', label: 'Questions Attempted', value: stats.attempted, icon: CircleCheck, className: 'fill-success text-white' },
        { id: 'correct', label: 'Correct Answers', value: stats.correct, icon: Target, className: 'text-accent-pink' },
        { id: 'wrong', label: 'Wrong Answers', value: stats.wrong, icon: CircleX, className: 'fill-danger text-white' },
        { id: 'completed', label: 'Tests Completed', value: stats.testsCompleted, icon: Clock, className: 'text-info' },
    ]

    return (
        <SectionCard
            icon={ChartColumn}
            title="Your Test Progress"
            action={{ label: 'View Analytics', to: '/analytics' }}
        >
            <div className="flex flex-wrap items-center gap-5">
                <ProgressRing value={stats.accuracy} size={130}>
                    <span className="text-2xl font-extrabold">{stats.accuracy}%</span>
                    <span className="text-ink-700 text-xs">Overall Accuracy</span>
                </ProgressRing>

                <ul className="divide-line min-w-48 flex-1 divide-y">
                    {rows.map(({ id, label, value, icon: Icon, className }) => (
                        <li key={id} className="flex items-center gap-3 py-2 text-sm">
                            <Icon className={`size-5 shrink-0 ${className}`} />
                            <span className="flex-1">{label}</span>
                            <span className="font-bold">{value.toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </SectionCard>
    )
}

export default TestProgressCard