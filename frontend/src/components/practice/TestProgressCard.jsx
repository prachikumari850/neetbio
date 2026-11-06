import { ChartColumn, CircleCheck, CircleX, Clock, Target } from 'lucide-react'
import ProgressRing from '@/components/common/ProgressRing'
import SectionCard from '@/components/common/SectionCard'
import { testProgress } from '@/data/mockPractice'

const statIcons = {
    attempted: { icon: CircleCheck, className: 'fill-success text-white' },
    correct: { icon: Target, className: 'text-accent-pink' },
    wrong: { icon: CircleX, className: 'fill-danger text-white' },
    completed: { icon: Clock, className: 'text-info' },
}

function TestProgressCard() {
    return (
        <SectionCard
            icon={ChartColumn}
            title="Your Test Progress"
            action={{ label: 'View Analytics', to: '/analytics' }}
        >
            <div className="flex flex-wrap items-center gap-5">
                <ProgressRing value={testProgress.accuracy} size={130}>
                    <span className="text-2xl font-extrabold">{testProgress.accuracy}%</span>
                    <span className="text-ink-700 text-xs">Overall Accuracy</span>
                </ProgressRing>

                <ul className="divide-line min-w-48 flex-1 divide-y">
                    {testProgress.stats.map(({ id, label, value }) => {
                        const { icon: Icon, className } = statIcons[id]

                        return (
                            <li key={id} className="flex items-center gap-3 py-2 text-sm">
                                <Icon className={`size-5 shrink-0 ${className}`} />
                                <span className="flex-1">{label}</span>
                                <span className="font-bold">{value}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </SectionCard>
    )
}

export default TestProgressCard