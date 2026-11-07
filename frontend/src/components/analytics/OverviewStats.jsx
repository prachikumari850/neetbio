import { Check, GraduationCap, Target, Timer } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Card from '@/components/common/Card'
import ProgressBar from '@/components/common/ProgressBar'
import { formatDuration } from '@/utils/formatters'

function OverviewStats({ data }) {
    const { totals, progress, accuracyChange } = data

    const cards = [
        {
            id: 'progress',
            label: 'Overall Progress',
            value: `${progress.percent}%`,
            icon: GraduationCap,
            bar: { value: progress.percent, tone: 'success' },
            caption: `${progress.mastered} of ${progress.totalQuestions} questions mastered`,
        },
        { id: 'tests', label: 'Tests Completed', value: totals.testsCompleted, icon: Target },
        {
            id: 'questions',
            label: 'Questions Correct',
            value: `${totals.correct.toLocaleString()} / ${totals.questionsAttempted.toLocaleString()}`,
            icon: Check,
            bar: { value: totals.accuracy ?? 0, tone: 'purple' },
            delta: accuracyChange,
        },
        { id: 'time', label: 'Practice Time', value: formatDuration(totals.practiceTimeSec), icon: Timer },
    ]

    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ id, label, value, icon: Icon, bar, caption, delta }) => (
                <li key={id}>
                    <Card className="h-full p-5">
                        <div className="flex items-center gap-4">
                            <span className="bg-brand-purple-soft text-brand-purple flex size-14 shrink-0 items-center justify-center rounded-full">
                                <Icon className="size-7" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-ink-700 text-sm font-semibold">{label}</p>
                                <p className="text-2xl font-extrabold">{value}</p>
                            </div>
                            {delta !== undefined && delta !== null && (
                                <Badge tone={delta >= 0 ? 'success' : 'danger'}>
                                    {delta >= 0 ? '↑ +' : '↓ '}
                                    {delta} pts
                                </Badge>
                            )}
                        </div>
                        {bar && <ProgressBar value={bar.value} tone={bar.tone} className="mt-4" />}
                        {caption && <p className="text-ink-500 mt-2 text-xs">{caption}</p>}
                    </Card>
                </li>
            ))}
        </ul>
    )
}

export default OverviewStats