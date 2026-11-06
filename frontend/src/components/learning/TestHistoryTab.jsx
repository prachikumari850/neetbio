import { Trophy } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmptyState from '@/components/common/EmptyState'
import { useTestStore } from '@/store/useTestStore'
import { formatShortDate } from '@/utils/formatters'

function TestHistoryTab() {
    const results = useTestStore((state) => state.results)

    if (results.length === 0) {
        return (
            <Card>
                <EmptyState icon={Trophy} title="No tests taken yet">
                    <Button to="/practice" variant="soft">Go to Practice</Button>
                </EmptyState>
            </Card>
        )
    }

    return (
        <Card className="divide-line divide-y">
            {results.map((result) => (
                <div key={result.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <span className="min-w-0 flex-1">
                        <span className="block font-bold">{result.title}</span>
                        <span className="text-ink-500 text-xs">
                            {formatShortDate(result.takenAt)} • {result.minutes} min
                        </span>
                    </span>
                    <span className="font-bold">
                        {result.correct} / {result.total}
                    </span>
                    <Badge tone={result.accuracy >= 75 ? 'success' : 'danger'}>{result.accuracy}%</Badge>
                </div>
            ))}
        </Card>
    )
}

export default TestHistoryTab